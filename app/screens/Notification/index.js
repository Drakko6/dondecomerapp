import React, { Component } from "react";
import { RefreshControl, FlatList } from "react-native";
import { BaseStyle, BaseColor } from "@config";
import { Header, SafeAreaView, Icon, ListThumbCircle } from "@components";
import styles from "./styles";

import { connect } from "react-redux";
import { AuthActions } from "@actions";
import { bindActionCreators } from "redux";
import API from "../../config/api";

// Load sample data
import { NotificationData } from "@data";

// TO DO: esta parte se conectará con firebase para los beacons (Menús)
class Notification extends Component {
  constructor(props) {
    super(props);
    this.state = {
      refreshing: false,
      notification: [],
    };
  }

  componentDidMount() {
    //console.log("Notification Page : Start");

    this.props.actions.authentication(
      "notifications",
      "credential",
      (response) => {
        //console.log(response.response);
        if (response.success) {
          this.setState({
            notification: response.response.notifications,
          });
        } else {
          this.setState({
            loading: false,
          });
          ToastAndroid.show("Failed", ToastAndroid.SHORT);
        }
      }
    );
  }

  render() {
    const { navigation } = this.props;
    let { notification } = this.state;
    return (
      <SafeAreaView
        style={BaseStyle.safeAreaView}
        forceInset={{ top: "always" }}
      >
        <Header
          title="Notificaciones"
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
        <FlatList
          refreshControl={
            <RefreshControl
              colors={[BaseColor.primaryColor]}
              tintColor={BaseColor.primaryColor}
              refreshing={this.state.refreshing}
              onRefresh={() => {}}
            />
          }
          data={notification}
          keyExtractor={(item, index) => item.id}
          renderItem={({ item, index }) => (
            <ListThumbCircle
              image={{ uri: API.URL + item.image }}
              txtLeftTitle={item.title}
              txtContent={item.description}
              txtRight={item.created_at.substr(0, 10)}
              onPress={() => console.log(item)}
            />
          )}
        />
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
)(Notification);
