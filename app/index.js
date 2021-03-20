import React, { Component, useEffect } from "react";
import { store, persistor } from "app/store";
import { StatusBar, AsyncStorage, Alert, Linking } from "react-native";
import { BaseColor } from "@config";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import App from "./navigation";
import memoize from "lodash.memoize";
import i18n from "i18n-js";
import * as RNLocalize from "react-native-localize";
import { I18nManager } from "react-native";
import PushNotification from "react-native-push-notification";
import RNLocation from "react-native-location";

// import NotifService from "./components/NotifService";
import {
  Platform,
  DeviceEventEmitter,
  NativeEventEmitter,
  PermissionsAndroid,
} from "react-native";

// import Beacons from "@nois/react-native-beacons-manager";
import Beacons from "@hkpuits/react-native-beacons-manager";

import { BluetoothStatus } from "react-native-bluetooth-status";
import firebase from "./config/firebase";

const region = {
  identifier: "beaconDondeComer",
  uuid: "d77657c4-52a7-426f-b9d0-d71e10798c8a",
};

const detectarBeacons = async () => {
  try {
    await Beacons.init();
  } catch (error) {}
  Beacons.setBackgroundBetweenScanPeriod(0);
  Beacons.setBackgroundScanPeriod(2000);
  Beacons.setForegroundScanPeriod(3600000);
  Beacons.detectIBeacons();

  //Se va a cambiar la lógica, una vez recabadas las campañas, sacar de ahí los beacons
  //Se va a crear un Monitoreo para cada region y se lanzará la notificación con lo que traiga
  //(Se puede hacer un map)

  try {
    Beacons.requestAlwaysAuthorization();

    Beacons.startUpdatingLocation();
  } catch (error) {}

  if (Platform.OS === "android") {
    // for android, startMonitoring after beaconService is connected
    // Beacons.BeaconsEventEmitter.removeAllListeners('beaconServiceConnected');
    Beacons.BeaconsEventEmitter.addListener(
      "beaconServiceConnected",
      async () => {
        // add codes to monitor the beacons
        // ...e.g.
        Beacons.startMonitoringForRegion(region)
          .then(() =>
            console.log(
              `Beacon ${region.identifier} monitoring started succesfully`
            )
          )
          .catch((error) =>
            console.log(
              `Beacon ${
                region.identifier
              }  monitoring not started, error: ${error}`
            )
          );
      }
    );
  } else {
    // add codes to monitor the beacons
    // ...e.g.
    Beacons.startMonitoringForRegion(region)
      .then(() =>
        console.log(
          `Beacon ${region.identifier} monitoring started succesfully`
        )
      )
      .catch((error) =>
        console.log(
          `Beacon ${region.identifier}  monitoring not started, error: ${error}`
        )
      );
  }

  Beacons.startRangingBeaconsInRegion("All")
    .then(() => console.log("Beacons ranging started succesfully"))
    .catch((error) =>
      console.log(`Beacons ranging not started, error: ${error}`)
    );

  Beacons.BeaconsEventEmitter.addListener("beaconsDidRange", (data) => {
    console.log("beaconsDidRange: ", data.beacons);
  });

  Beacons.BeaconsEventEmitter.addListener("regionDidEnter", (data) => {
    console.log("region did enter", data);

    PushNotification.localNotification({
      channelId: "channel-id",
      title: "Hola", // (optional)
      message: "Esta es una notificación de donde comer", // (required)
    });
  });

  Beacons.BeaconsEventEmitter.addListener("regionDidExit", (data) => {
    console.log("region did exit");
  });
};

PushNotification.configure({
  onRegister: function(token) {
    console.log("TOKEN:", token);
  },

  onNotification: function(notification) {
    console.log("NOTIFICATION:", notification);

    // notification.finish(PushNotificationIOS.FetchResult.NoData);
  },

  onAction: function(notification) {
    console.log("ACTION:", notification.action);
    console.log("NOTIFICATION:", notification);
  },

  onRegistrationError: function(err) {
    console.error(err.message, err);
  },

  permissions: {
    alert: true,
    badge: true,
    sound: true,
  },

  popInitialNotification: true,
  requestPermissions: true,
});

PushNotification.createChannel(
  {
    channelId: "channel-id", // (required)
    channelName: "My channel", // (required)
    channelDescription: "A channel to categorise your notifications", // (optional) default: undefined.
    playSound: true, // (optional) default: true
    soundName: "default", // (optional) See `soundName` parameter of `localNotification` function
    importance: 4, // (optional) default: 4. Int value of the Android notification importance
    vibrate: true, // (optional) default: true. Creates the default vibration patten if true.
  },
  (created) => console.log(`createChannel returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
);

const anonymousLog = () => {
  firebase.auth
    .signInAnonymously()
    .then(() => {
      // Signed in..
    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      // ...
    });
};

const isAndroid = Platform.OS === "android";

const createAlertPermission = async () =>
  Alert.alert(
    "Permisos de localización necesarios",
    "Necesitamos el permiso de ubicación siempre para poder detectar los beacons de restaurantes",
    [
      {
        text: "Okay",
        onPress: () =>
          RNLocation.requestPermission({
            ios: "always",
            android: {
              detail: "fine",
            },
          }),
      },
    ],
    { cancelable: false }
  );

const createButtonAlert = () =>
  Alert.alert(
    "Bluetooth Necesario",
    "Esta aplicación requiere el Bluetooth activado para funcionar correctamente, favor de activar",
    [
      {
        text: isAndroid ? "Activar" : "OK",
        onPress: isAndroid
          ? () => BluetoothStatus.enable()
          : () => console.log("OK Pressed"),
      },
    ],
    { cancelable: false }
  );

const getBluetoothState = async () => {
  const isEnabled = await BluetoothStatus.state();

  if (!isEnabled) {
    createButtonAlert();
  }
};

console.disableYellowBox = true;

const translationGetters = {
  // lazy requires (metro bundler does not support symlinks)
  en: () => require("./lang/en.json"),
  fr: () => require("./lang/fr.json"),
};

const translate = memoize(
  (key, config) => i18n.t(key, config),
  (key, config) => (config ? key + JSON.stringify(config) : key)
);

const setI18nConfig = () => {
  // fallback if no available language fits
  const fallback = { languageTag: "en", isRTL: false };

  const { languageTag, isRTL } =
    RNLocalize.findBestAvailableLanguage(Object.keys(translationGetters)) ||
    fallback;

  // clear translation cache
  translate.cache.clear();
  // update layout direction
  I18nManager.forceRTL(isRTL);
  // set i18n-js config
  i18n.translations = { [languageTag]: translationGetters[languageTag]() };
  i18n.locale = languageTag;
};

export default class index extends Component {
  constructor(props) {
    super(props);

    setI18nConfig();

    this.state = {
      campanas: [],
      beacons: [],
    };
  }

  checkPermissions = async () => {
    const permiso = await RNLocation.checkPermission({
      ios: "always", // or 'always'
      android: {
        detail: "fine", // or 'fine'
      },
    });

    console.log(permiso);
    if (!permiso) {
      createAlertPermission();
    }
  };

  recabarCampanas = async () => {
    firebase.db
      .collection("campanas")
      .get()
      .then((docs) => {
        const campanas = docs.docs.map((doc) => {
          return {
            id: doc.id,
            ...doc.data(),
          };
        });

        this.setState({ campanas: campanas });
      });
  };

  async componentDidMount() {
    // this.checkPermissions();
    getBluetoothState();
    anonymousLog();
    await this.recabarCampanas();
    await detectarBeacons();

    StatusBar.setBackgroundColor(BaseColor.primaryColor, true);
    RNLocalize.addEventListener("change", this.handleLocalizationChange);

    AsyncStorage.getItem("user_id").then((error, value) => {
      // console.log(value);
      if (value != null && value == "") {
        store.getState().auth.login.success = true;
        // console.log("logined xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx")
      } else {
        store.getState().auth.login.success = false;
        // console.log("not logined xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx")
      }
    });
  }

  componentWillUnmount() {
    RNLocalize.removeEventListener("change", this.handleLocalizationChange);
  }

  handleLocalizationChange = () => {
    setI18nConfig();
    this.forceUpdate();
  };

  //1
  // async checkPermission() {
  //   this.notif = new NotifService(
  //     this.onRegister.bind(this),
  //     this.onNotif.bind(this)
  //   );
  // }

  onRegister(token) {
    //Alert.alert("Registered !-------------------", JSON.stringify(token));
    console.log(JSON.stringify(token.token));
    this.setState({ registerToken: token.token, gcmRegistered: true });
    AsyncStorage.setItem("token", token.token);
  }

  onNotif(notif) {
    if (notif.userInteraction) {
      Linking.canOpenURL(notif.url).then((supported) => {
        if (supported) {
          Linking.openURL(notif.url);
        } else {
          //console.log("Don't know how to open URI: " + notif.url);
        }
      });
    }
  }

  handlePerm(perms) {
    if (JSON.stringify(perms.alert)) {
      //this.notif.configure(this.onRegister.bind(this), this.onNotif.bind(this), "692902621862")
    }
  }

  render() {
    return (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <App />
        </PersistGate>
      </Provider>
    );
  }
}
