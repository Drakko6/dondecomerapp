import Beacons from "@hkpuits/react-native-beacons-manager";

const region = {
  identifier: "Estimotes",
  uuid: "B9407F30-F5F8-466E-AFF9-25556B57FE6D",
};

module.exports = async (event) => {
  if (Platform.OS === "ios") {
    Beacons.startUpdatingLocation();
  }

  // add codes to handle events returned by the monitoring beacons
  // ... e.g.
  if (Platform.OS === "android") {
    Beacons.BeaconsEventEmitter.removeAllListeners();
  }

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

  this.regionDidEnterEvent = Beacons.BeaconsEventEmitter.addListener(
    "regionDidEnter",
    (data) => {
      // good place for background tasks
      console.log("region did enter");
      // do something
    }
  );

  this.regionDidExitEvent = Beacons.BeaconsEventEmitter.addListener(
    "regionDidExit",
    (data) => {
      // good place for background tasks
      console.log("region did exit");
      // do something
    }
  );
};
