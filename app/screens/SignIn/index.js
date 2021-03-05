import React, { Component } from "react";
import { connect } from "react-redux";
import { AuthActions } from "@actions";
import { bindActionCreators } from "redux";
import {
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ToastAndroid,
  AsyncStorage,
} from "react-native";
import { BaseStyle, BaseColor } from "@config";
import { Header, SafeAreaView, Icon, Text, Button } from "@components";
import styles from "./styles";
import { store } from "app/store";
const FBSDK = require("react-native-fbsdk");
var FBLoginButton = require("../../components/FBLoginButton/index");
import { LoginManager, AccessToken } from "react-native-fbsdk";
import { log } from "react-native-reanimated";

class SignIn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: "test@test.com",
      password: "test",
      loading: false,
      success: {
        id: true,
        password: true,
      },
    };
  }

  initUser = (token) => {
    const { navigation } = this.props;
    fetch(
      "https://graph.facebook.com/v2.5/me?fields=email,first_name,last_name,friends&access_token=" +
        token
    )
      .then((response) => {
        response.json().then((json) => {
          const ID = json.id;
          //console.log("ID " + ID);

          const EM = json.email;
          //console.log("Email " + EM);

          const FN = json.first_name;
          //console.log("First Name " + FN);
        });
      })
      .catch(() => {
        //console.log("ERROR GETTING DATA FROM FACEBOOK");
      });
  };

  loginFacebook() {
    LoginManager.logOut();
    LoginManager.logInWithPermissions(["public_profile"]).then(
      function(result) {
        if (result.isCancelled) {
          //console.log("Login was cancelled");
        } else {
          AccessToken.getCurrentAccessToken().then((data) => {
            const { accessToken } = data;
            //console.log(accessToken);
            fetch(
              "https://graph.facebook.com/v2.5/me?fields=email,first_name,picture,last_name,friends&access_token=" +
                accessToken
            )
              .then((response) => {
                response.json().then((json) => {
                  AsyncStorage.setItem("user_id", json.id);
                  store.getState().auth.login.success = true;
                  navigation.navigate("Home");
                });
              })
              .catch(() => {
                //console.log("ERROR GETTING DATA FROM FACEBOOK");
              });
          });
        }
      },
      function(error) {
        //console.log("Login failed with error: " + error);
      }
    );
  }

  onLogin() {
    const { id, password, success } = this.state;
    const { navigation } = this.props;
    const { dispatch } = this.props;

    if (id == "" || password == "") {
      this.setState({
        success: {
          ...success,
          id: false,
          password: false,
        },
      });
    } else {
      this.setState(
        {
          loading: true,
        },
        () => {
          let credential = {
            password: password,
            email: id,
          };

          AsyncStorage.getItem("token")
            .then((value) => {
              credential = {
                password: password,
                email: id,
                token: value,
              };
              this.props.actions.authentication(
                "login",
                credential,
                (response) => {
                  if (response.success) {
                    //console.log(response.response.id);
                    //await AsyncStorage.setItem('user_id', response.response.id.toString());
                    AsyncStorage.setItem(
                      "user_id",
                      response.response.id.toString()
                    );
                    store.getState().auth.login.success = true;
                    navigation.navigate("Home");
                  } else {
                    this.setState({
                      loading: false,
                    });
                    ToastAndroid.show("Failed", ToastAndroid.SHORT);
                  }
                }
              );
            })
            .then((res) => {
              //do something else
            });
        }
      );
    }
  }

  render() {
    const { navigation } = this.props;
    return (
      <SafeAreaView
        style={BaseStyle.safeAreaView}
        forceInset={{ top: "always" }}
      >
        <Header
          title="Cuenta"
          renderLeft={() => {
            return (
              <Icon
                name="arrow-left"
                size={20}
                color={BaseColor.primaryColor}
              />
            );
          }}
          onPressLeft={() => {
            navigation.goBack();
          }}
        />
        <ScrollView>
          <View style={styles.contain}>
            <TextInput
              style={[BaseStyle.textInput, { marginTop: 65 }]}
              onChangeText={(text) => this.setState({ id: text })}
              onFocus={() => {
                this.setState({
                  success: {
                    ...this.state.success,
                    id: true,
                  },
                });
              }}
              autoCorrect={false}
              placeholder="Usuario"
              keyboardType="email-address"
              placeholderTextColor={
                this.state.success.id
                  ? BaseColor.grayColor
                  : BaseColor.primaryColor
              }
              value={this.state.id}
              selectionColor={BaseColor.primaryColor}
            />
            <TextInput
              style={[BaseStyle.textInput, { marginTop: 10 }]}
              onChangeText={(text) => this.setState({ password: text })}
              onFocus={() => {
                this.setState({
                  success: {
                    ...this.state.success,
                    password: true,
                  },
                });
              }}
              autoCorrect={false}
              placeholder="Contraseña"
              secureTextEntry={true}
              placeholderTextColor={
                this.state.success.password
                  ? BaseColor.grayColor
                  : BaseColor.primaryColor
              }
              value={this.state.password}
              selectionColor={BaseColor.primaryColor}
            />

            <View style={{ width: "100%" }}>
              <Button
                full
                loading={this.state.loading}
                style={{ marginTop: 20, marginBottom: 20 }}
                onPress={() => {
                  this.onLogin();
                }}
              >
                Iniciar Sesión
              </Button>
              <Button
                style={{ backgroundColor: "#3b5998" }}
                onPress={() => {
                  LoginManager.logOut();
                  LoginManager.logInWithPermissions([
                    "public_profile",
                    "email",
                  ]).then(
                    function(result) {
                      if (result.isCancelled) {
                        //console.log("Login was cancelled");
                      } else {
                        AccessToken.getCurrentAccessToken().then((data) => {
                          const { accessToken } = data;
                          //console.log("access_token", accessToken);
                          fetch(
                            "https://graph.facebook.com/v2.5/me?fields=email,first_name,last_name,picture&access_token=" +
                              accessToken +
                              "&redirect=false"
                          )
                            .then((response) => {
                              response.json().then(async (json) => {
                                //console.log(json);
                                await AsyncStorage.setItem(
                                  "user_token",
                                  accessToken
                                );
                                await AsyncStorage.setItem("user_id", json.id);
                                await AsyncStorage.setItem(
                                  "user_f_name",
                                  json.first_name
                                );
                                await AsyncStorage.setItem(
                                  "user_l_name",
                                  json.last_name
                                );
                                await AsyncStorage.setItem(
                                  "user_pic",
                                  json.picture.data.url
                                );
                                store.getState().auth.login.success = true;
                                navigation.navigate("Home");
                              });
                            })
                            .catch(() => {
                              //console.log("ERROR GETTING DATA FROM FACEBOOK");
                            });
                        });
                      }
                    },
                    function(error) {
                      //console.log("Login failed with error: " + error);
                    }
                  );
                }}
                title="Iniciar Sesión"
              >
                <Icon color={"#fff"} name="facebook" size={20} solid />
                &nbsp; Iniciar Sesión con Facebook
              </Button>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
              <Text body1 grayColor style={{ marginTop: 25 }}>
                Crear nuevo usuario
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
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
)(SignIn);
