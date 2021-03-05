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
import NotifService from "./components/NotifService";

// push  notification
//https://medium.com/@Jscrambler/implementing-react-native-push-notifications-in-android-apps-7e0234dee7b7

import { Text } from "@components";

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
  }

  async componentDidMount() {
    this.checkPermission();

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
  async checkPermission() {
    this.notif = new NotifService(
      this.onRegister.bind(this),
      this.onNotif.bind(this)
    );
  }

  onRegister(token) {
    //Alert.alert("Registered !-------------------", JSON.stringify(token));
    console.log(JSON.stringify(token.token));
    this.setState({ registerToken: token.token, gcmRegistered: true });
    AsyncStorage.setItem("token", token.token);
  }

  onNotif(notif) {
    //console.log(notif);
    //Alert.alert(notif.title, notif.message);
    //this.notif.localNotif();

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
