import React, { Component } from "react";
import {
  View,
  FlatList,
  TextInput,
  TouchableOpacity,
  AsyncStorage,
} from "react-native";
import { BaseStyle, BaseColor } from "@config";
import { Header, SafeAreaView, Icon, Text, Button } from "@components";
import styles from "./styles";

import { FilterAction } from "@actions";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as API from "../../config/api";

class ChooseLocation extends Component {
  constructor(props) {
    super(props);

    // Temp data define
    this.state = {
      country: "",
      location: [],
      s_location: [],
      loading: false,
    };

    this.props.actions.facilities("", (response) => {
      if (response.success) {
        this.setState({
          location: response.data.cities,
          s_location: response.data.cities,
        });
        AsyncStorage.setItem("cities", JSON.stringify(response.data.cities));
      } else {
        this.setState({
          loading: false,
        });
      }
    });
  }

  /**
   * @description make selected old data
   * @author Passion UI <passionui.com>
   * @date 2019-08-03
   * @param {object} select
   */
  componentDidMount() {
    const { navigation } = this.props;
    const selectedLocation = navigation.getParam("selected");
    if (selectedLocation.length > 0) {
      this.setState({
        location: this.state.location.map((item) => {
          return {
            ...item,
            checked: selectedLocation.some((check) => check.id == item.id),
          };
        }),
      });
    }
  }
  /**
   * @description Called when apply
   * @author Passion UI <passionui.com>
   * @date 2019-08-03
   * @param {object} select
   */
  onApply() {
    const { navigation } = this.props;
    const { location } = this.state;
    const onSave = navigation.getParam("onApply");
    this.setState(
      {
        loading: true,
      },
      () => {
        setTimeout(() => {
          onSave(location.filter((item) => item.checked));
          navigation.goBack();
        }, 100);
      }
    );
  }

  /**
   * @description Called when setting location is selected
   * @author Passion UI <passionui.com>
   * @date 2019-08-03
   * @param {object} select
   */
  onChange(select) {
    //console.log('changed choose location');
    this.setState({
      location: this.state.location.map((item) => {
        if (item.id == select.id) {
          return {
            ...item,
            checked: !item.checked,
          };
        }
        return item;
      }),
    });
  }

  render() {
    const { navigation } = this.props;
    let { location, s_location, loading } = this.state;
    return (
      <SafeAreaView
        style={BaseStyle.safeAreaView}
        forceInset={{ top: "always" }}
      >
        <Header
          title="Location"
          renderLeft={() => {
            return (
              <Icon name="times" size={20} color={BaseColor.primaryColor} />
            );
          }}
          onPressLeft={() => {
            navigation.goBack();
          }}
        />
        <View style={styles.contain}>
          <TextInput
            style={BaseStyle.textInput}
            onChangeText={(text) => {
              this.setState({ country: text });

              var marvelHeroes = s_location.filter(function(item) {
                //return item.city_name == text;
                return item.city_name.includes(text);
              });
              if (text == "") {
                marvelHeroes = s_location;
              }
              this.setState({ country: text, location: marvelHeroes });
            }}
            autoCorrect={false}
            placeholder="Search..."
            placeholderTextColor={BaseColor.grayColor}
            value={this.state.country}
            selectionColor={BaseColor.primaryColor}
          />

          <View style={{ flex: 1, paddingTop: 10 }}>
            <FlatList
              data={location}
              keyExtractor={(item, index) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.item}
                  onPress={() => this.onChange(item)}
                >
                  <Text
                    body1
                    style={
                      item.checked
                        ? {
                            color: BaseColor.primaryColor,
                          }
                        : {}
                    }
                  >
                    {item.city_name}
                  </Text>
                  {item.checked && (
                    <Icon
                      name="check"
                      size={14}
                      color={BaseColor.primaryColor}
                    />
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
          <Button full loading={loading} onPress={() => this.onApply()}>
            Apply
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
    actions: bindActionCreators(FilterAction, dispatch),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ChooseLocation);
