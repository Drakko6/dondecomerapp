import React, { Component } from "react";
import { FlatList, RefreshControl } from "react-native";
import { BaseStyle, BaseColor } from "@config";
import {
  Header,
  SafeAreaView,
  Icon,
  Text,
  RateDetail,
  CommentItem,
} from "@components";
import styles from "./styles";

// Load sample data
import { ReviewData } from "@data";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { ResAction } from "@actions";
import api from "../../config/api";

class Review extends Component {
  constructor(props) {
    super(props);

    const { state } = this.props.navigation;
    let data = state.params;

    this.state = {
      total_rate: "",
      restaurant_id: data.restaurant_id,
      rateDetail: {
        point: 5,
        maxPoint: 5,
        totalRating: 0,
        data: ["5%", "5%", "35%", "40%", "10%"],
      },
      reviewList: [],
    };
  }

  componentDidMount() {
    let credential = {
      restaurant_id: this.state.restaurant_id,
    };
    this.props.actions.restaurants("reviews", credential, (response) => {
      if (response.success) {
        //console.log(response);
        this.setState({
          reviewList: response.data.reviews,
          total_rate: response.data.total_rate,
        });
      } else {
        this.setState({
          loading: false,
        });
      }
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevProps.navigation.getParam("data", null) !=
      this.props.navigation.getParam("data", null)
    ) {
      let credential = {
        restaurant_id: this.state.restaurant_id,
      };
      this.props.actions.restaurants("reviews", credential, (response) => {
        if (response.success) {
          //console.log(response);
          this.setState({
            reviewList: response.data.reviews,
            rateDetail: {
              point: response.data.total_rate,
              maxPoint: 5,
              totalRating: response.data.reviews.length,
              data: ["5%", "5%", "35%", "40%", "10%"],
            },
          });
        } else {
          this.setState({
            loading: false,
          });
        }
      });
    }
  }

  render() {
    const { navigation } = this.props;
    let { rateDetail, reviewList } = this.state;
    return (
      <SafeAreaView
        style={BaseStyle.safeAreaView}
        forceInset={{ top: "always" }}
      >
        <Header
          title="Review"
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
                Write
              </Text>
            );
          }}
          onPressLeft={() => {
            navigation.goBack();
          }}
          onPressRight={() => {
            navigation.navigate("Feedback", {
              restaurant_id: this.state.restaurant_id,
            });
          }}
        />
        {/* Sample User Review List */}
        <FlatList
          style={{ padding: 20 }}
          refreshControl={
            <RefreshControl
              colors={[BaseColor.primaryColor]}
              tintColor={BaseColor.primaryColor}
              refreshing={this.state.refreshing}
              onRefresh={() => {}}
            />
          }
          data={reviewList}
          keyExtractor={(item, index) => item.id}
          ListHeaderComponent={() => (
            <RateDetail
              point={rateDetail.point}
              maxPoint={rateDetail.maxPoint}
              totalRating={rateDetail.totalRating}
              data={rateDetail.data}
            />
          )}
          renderItem={({ item }) => (
            <CommentItem
              style={{ marginTop: 10 }}
              image={item.source}
              name={item.name}
              rate={item.rate}
              date={item.date}
              title={item.title}
              comment={item.comment}
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
    actions: bindActionCreators(ResAction, dispatch),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Review);
