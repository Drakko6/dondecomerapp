import React, { Component } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  Switch,
  AsyncStorage,
} from "react-native";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { AuthActions } from "@actions";
import { BaseStyle, BaseColor, BaseSetting } from "@config";
import {
  Header,
  SafeAreaView,
  Icon,
  Text,
  Button,
  ProfileDetail,
  ProfilePerformance,
} from "@components";
import styles from "./styles";

// Load sample data
import { UserData } from "@data";
import { store } from "app/store";
import { log } from "react-native-reanimated";

class Profile extends Component {
  constructor(props) {
    super();
    this.state = {
      notification: false,
      loading: false,
      userData: UserData[0],
    };
  }

  /**
   * @description Simple logout with Redux
   * @author Passion UI <passionui.com>
   * @date 2019-09-01
   */
  onLogOut() {
    //AsyncStorage.setItem("user_id", "");
    this.props.navigation.navigate("Home");
    store.getState().auth.login.success = false;

    // this.setState(
    //   {
    //     loading: true
    //   },
    //   () => {
    //     this.props.actions.authentication(false, response => {
    //       if (response.success) {
    //         this.props.navigation.navigate("Loading");
    //       } else {
    //         this.setState({ loading: false });
    //       }
    //     });
    //   }
    // );
  }

  /**
   * @description Call when reminder option switch on/off
   */
  toggleSwitch = (value) => {
    this.setState({ notification: value });
  };

  async getData() {
    try {
      const value = await AsyncStorage.getItem("user_pic");
      //console.log(value);
      this.setState({ pic: value });
    } catch (error) {
      //console.log("Error retrieving data" + error);
    }
  }

  _getUserData = async () => {
    let id = await AsyncStorage.getItem("user_id");
    let pic = await AsyncStorage.getItem("user_pic");
    // let id = await AsyncStorage.getItem('user_id');

    return id;
  };

  async componentDidMount() {
    try {
      const value = await AsyncStorage.getItem("user_pic");
      const name = await AsyncStorage.getItem("user_f_name");
      const lname = await AsyncStorage.getItem("user_l_name");
      const id = await AsyncStorage.getItem("user_id");
      const token = await AsyncStorage.getItem("user_token");
      //console.log('u_token', id);
      //console.log(value);
      this.setState({
        pic: value,
        name: name,
        lname: lname,
        id: id,
        token: token,
      });
    } catch (error) {
      //console.log("Error retrieving data" + error);
    }
  }

  render() {
    const { navigation } = this.props;
    const { userData, loading, notification, pic, id } = this.state;
    this.getData;
    return (
      <SafeAreaView
        style={BaseStyle.safeAreaView}
        forceInset={{ top: "always" }}
      >
        <Header
          title="Profile"
          renderRight={() => {
            return (
              <Icon name="bell" size={24} color={BaseColor.primaryColor} />
            );
          }}
          renderRightSecond={() => {
            return (
              <Icon name="envelope" size={24} color={BaseColor.primaryColor} />
            );
          }}
          onPressRight={() => {
            navigation.navigate("Notification");
          }}
          onPressRightSecond={() => {
            navigation.navigate("Messenger");
          }}
        />

        <ScrollView>
          <View style={styles.contain}>
            <ProfileDetail
              image={
                "https://graph.facebook.com/" +
                this.state.id +
                "/picture&redirect=true&access_token=" +
                this.state.token
              }
              textFirst={this.state.name + " " + this.state.lname}
              point={userData.point}
              textSecond={userData.address}
              textThird={this.state.id}
              onPress={() => navigation.navigate("ProfileExample")}
            />
            <ProfilePerformance
              data={userData.performance}
              style={{ marginTop: 20, marginBottom: 20 }}
            />
            <View style={{ width: "100%" }}>
              <TouchableOpacity
                style={styles.profileItem}
                onPress={() => {
                  navigation.navigate("ProfileEdit");
                }}
              >
                <Text body1>Edit Profile</Text>
                <Icon
                  name="angle-right"
                  size={18}
                  color={BaseColor.primaryColor}
                  style={{ marginLeft: 5 }}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.profileItem}
                onPress={() => {
                  navigation.navigate("ChangePassword");
                }}
              >
                <Text body1>Change Password</Text>
                <Icon
                  name="angle-right"
                  size={18}
                  color={BaseColor.primaryColor}
                  style={{ marginLeft: 5 }}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.profileItem}
                onPress={() => {
                  navigation.navigate("ChangeLanguage");
                }}
              >
                <Text body1>Language</Text>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <Text body1 grayColor>
                    English
                  </Text>
                  <Icon
                    name="angle-right"
                    size={18}
                    color={BaseColor.primaryColor}
                    style={{ marginLeft: 5 }}
                  />
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.profileItem}
                onPress={() => {
                  navigation.navigate("Whislist");
                }}
              >
                <Text body1>Whislist</Text>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <Text body1 grayColor>
                    109
                  </Text>
                  <Icon
                    name="angle-right"
                    size={18}
                    color={BaseColor.primaryColor}
                    style={{ marginLeft: 5 }}
                  />
                </View>
              </TouchableOpacity>
              <View style={styles.profileItem}>
                <Text body1>Notification</Text>
                <Switch
                  name="angle-right"
                  size={18}
                  onValueChange={this.toggleSwitch}
                  value={notification}
                />
              </View>
              <TouchableOpacity
                style={styles.profileItem}
                onPress={() => {
                  navigation.navigate("ContactUs");
                }}
              >
                <Text body1>ContactUs</Text>
                <Icon
                  name="angle-right"
                  size={18}
                  color={BaseColor.primaryColor}
                  style={{ marginLeft: 5 }}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.profileItem}
                onPress={() => {
                  navigation.navigate("AboutUs");
                }}
              >
                <Text body1>About Us</Text>
                <Icon
                  name="angle-right"
                  size={18}
                  color={BaseColor.primaryColor}
                  style={{ marginLeft: 5 }}
                />
              </TouchableOpacity>
              <TouchableOpacity style={styles.profileItem}>
                <Text body1>Version</Text>
                <Text body1 grayColor>
                  {BaseSetting.appVersion}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
        <View style={{ padding: 20 }}>
          <Button full loading={loading} onPress={() => this.onLogOut()}>
            Sign Out
          </Button>
        </View>
      </SafeAreaView>
    );
  }
}

const mapStateToProps = (state) => {
  return {};
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(AuthActions, dispatch),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Profile);
