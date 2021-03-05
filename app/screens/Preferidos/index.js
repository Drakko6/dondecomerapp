import React, { Component } from "react";
import { FlatList, RefreshControl, AsyncStorage } from "react-native";
import { BaseStyle, BaseColor } from "@config";
import { Header, SafeAreaView, CardList } from "@components";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { ResAction } from "@actions";
import api from "../../config/api";

class Preferidos extends Component {
  constructor(props) {
    super(props);

    this.state = {
      refreshing: false,
      whislist: [],
    };
  }

  componentDidMount() {
    this.reloadData();
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevProps.navigation.getParam("id", 2) !=
      this.props.navigation.getParam("id", 2)
    ) {
    } else {
    }
  }

  reloadData() {
    AsyncStorage.getItem("user_id")
      .then((value) => {
        if (value != null) {
          let credential = {
            user_id: value,
          };

          this.props.actions.restaurants(
            "favorites",
            credential,
            (response) => {
              if (response.success) {
                this.setState({
                  whislist: response.data.restaurants,
                });
              } else {
                this.setState({
                  loading: false,
                });
              }
            }
          );
        }
      })
      .then((res) => {
        //console.log(res);
      });
  }

  render() {
    const { navigation } = this.props;
    let { whislist } = this.state;
    return (
      <SafeAreaView
        style={BaseStyle.safeAreaView}
        forceInset={{ top: "always" }}
      >
        <Header title="Preferidos" />

        <FlatList
          contentContainerStyle={{
            margin: 20,
          }}
          refreshControl={
            <RefreshControl
              colors={[BaseColor.primaryColor]}
              tintColor={BaseColor.primaryColor}
              refreshing={this.state.refreshing}
              onRefresh={() => {
                //console.log("refresh");
                this.reloadData();
              }}
            />
          }
          data={whislist}
          keyExtractor={(item, index) => item.id}
          renderItem={({ item, index }) => (
            <CardList
              image={{ uri: api.URL + item.img }}
              title={item.title}
              subtitle={item.cat_title}
              rate={item.rate}
              style={{ marginBottom: 20 }}
              onPress={() =>
                navigation.navigate("PlaceDetail", { id: item.id })
              }
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
)(Preferidos);
