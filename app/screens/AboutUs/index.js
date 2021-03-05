import React, { Component } from "react";
import { View, ScrollView } from "react-native";
import { BaseStyle, BaseColor, Images } from "@config";
import {
  Image,
  Header,
  SafeAreaView,
  Icon,
  Text,
  Card,
  ProfileDescription,
} from "@components";
import * as Utils from "@utils";
import { AboutUsData } from "@data";
import styles from "./styles";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { ResAction } from "@actions";
import api from "../../config/api";
import HTML from "react-native-render-html";

class AboutUs extends Component {
  constructor(props) {
    super(props);

    // Temp data define
    this.state = {
      about: {
        image: "",
        title: "",
      },
      ourTeam: AboutUsData,
    };
  }

  componentDidMount() {
    let credential = {
      restaurant_id: this.state.restaurant_id,
    };
    this.props.actions.restaurants("about", "", (response) => {
      if (response.success) {
        //console.log(response);

        this.setState({
          about: response.data.about,
        });
      } else {
        this.setState({
          loading: false,
        });
      }
    });
  }

  render() {
    const { navigation } = this.props;
    const { about } = this.state;
    return (
      <SafeAreaView
        style={BaseStyle.safeAreaView}
        forceInset={{ top: "always" }}
      >
        <Header
          title="About Us"
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
          <View>
            <Image
              source={{ uri: api.URL + about.image }}
              style={{ width: "100%", height: 135 }}
            />

            <View style={styles.titleAbout}>
              <Text title1 semibold whiteColor>
                {about.title}
              </Text>
              {/* <Text subhead whiteColor>
                a journey into the past
              </Text> */}
            </View>
          </View>

          <View style={{ padding: 20 }}>
            <HTML html={about.description} />

            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                justifyContent: "space-between",
              }}
            >
              {this.state.ourTeam.map((item, index) => {
                return (
                  <View
                    style={{
                      height: 200,
                      width: Utils.getWidthDevice() / 2 - 30,
                      marginBottom: 20,
                    }}
                    key={"ourTeam" + index}
                  >
                    <Card
                      image={item.image}
                      onPress={() => navigation.navigate(item.screen)}
                    >
                      <Text footnote whiteColor>
                        {item.subName}
                      </Text>
                      <Text headline whiteColor semibold>
                        {item.name}
                      </Text>
                    </Card>
                  </View>
                );
              })}
            </View>
            <Text headline semibold>
              OUR SERVICE
            </Text>
            {this.state.ourTeam.map((item, index) => {
              return (
                <ProfileDescription
                  key={"service" + index}
                  image={item.image}
                  name={item.name}
                  subName={item.subName}
                  description={item.description}
                  style={{ marginTop: 10 }}
                  onPress={() => navigation.navigate(item.screen)}
                />
              );
            })}
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
    actions: bindActionCreators(ResAction, dispatch),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AboutUs);
