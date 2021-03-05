import React, { Component } from "react";
import { View, ScrollView, TextInput, AsyncStorage } from "react-native";
import { BaseStyle, BaseColor, Images } from "@config";
import {
  Image,
  Header,
  SafeAreaView,
  Icon,
  Text,
  StarRating,
} from "@components";
import styles from "./styles";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { ResAction } from "@actions";
import api from "../../config/api";

class Feedback extends Component {
  constructor(props) {
    super(props);

    const { state } = this.props.navigation;
    let data = state.params;

    this.state = {
      restaurant_id: data.restaurant_id,
      rate: 4.5,
      title: "",
      review: "",
    };
  }

  rate() {
    AsyncStorage.getItem("user_id").then((value) => {
      let credential = {
        user_id: value,
        rate: this.state.rate,
        restaurant_id: this.state.restaurant_id,
      };
      //console.log(credential);
      this.props.actions.restaurants("addreview", credential, (response) => {
        if (response.success) {
          //console.log(response);
          this.props.navigation.navigate("Review", { data: response });
        } else {
          this.setState({
            loading: false,
          });
        }
      });
    });
  }

  render() {
    const { navigation } = this.props;
    return (
      <SafeAreaView
        style={BaseStyle.safeAreaView}
        forceInset={{ top: "always" }}
      >
        <Header
          title="Calificación"
          renderLeft={() => {
            return (
              <Icon
                name="arrow-left"
                size={20}
                color={BaseColor.primaryColor}
              />
            );
          }}
          renderRight={() => {
            return (
              <Text headline primaryColor numberOfLines={1}>
                Guardar
              </Text>
            );
          }}
          onPressLeft={() => {
            navigation.goBack();
          }}
          onPressRight={() => {
            //navigation.navigate("Review");
            this.rate();
          }}
        />
        <ScrollView>
          <View style={{ alignItems: "center", padding: 20 }}>
            <Image
              source={Images.profile2}
              style={{
                width: 62,
                height: 62,
                borderRadius: 31,
              }}
            />
            <View style={{ width: 160 }}>
              <StarRating
                starSize={26}
                maxStars={5}
                rating={this.state.rate}
                selectedStar={(rating) => {
                  this.setState({ rate: rating });
                }}
                fullStarColor={BaseColor.yellowColor}
                containerStyle={{ padding: 5 }}
              />
              <Text caption1 grayColor style={{ textAlign: "center" }}>
                Presiona una estrella para calificar{" "}
              </Text>
            </View>
            {/* <TextInput
              style={[BaseStyle.textInput, { marginTop: 10 }]}
              onChangeText={text => this.setState({ title: text })}
              autoCorrect={false}
              placeholder="Title"
              placeholderTextColor={BaseColor.grayColor}
              value={this.state.title}
              selectionColor={BaseColor.primaryColor}
            />
            <TextInput
              style={[BaseStyle.textInput, { marginTop: 20 }]}
              onChangeText={text => this.setState({ review: text })}
              textAlignVertical="top"
              multiline={true}
              autoCorrect={false}
              placeholder="Reviews"
              placeholderTextColor={BaseColor.grayColor}
              value={this.state.review}
              selectionColor={BaseColor.primaryColor}
            /> */}
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
)(Feedback);
