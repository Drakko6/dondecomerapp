import React, { Component } from "react";
import {
  View,
  ScrollView,
  FlatList,
  Animated,
  TouchableOpacity,
  TouchableNativeFeedback,
  TouchableHighlight,
  Platform,
  Linking,
  Alert,
  AsyncStorage,
} from "react-native";
import { BaseStyle, BaseColor, Images } from "@config";
import Geocoder from "react-native-geocoding";
import {
  Header,
  SafeAreaView,
  Icon,
  Text,
  StarRating,
  Tag,
  Image,
  PlaceItem,
  CardList,
} from "@components";
import MapView, { PROVIDER_GOOGLE, Marker } from "react-native-maps";
import * as Utils from "@utils";
import styles from "./styles";
import Swiper from "react-native-swiper";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { ResAction } from "@actions";
import * as API from "../../config/api";
import { WebView } from "react-native-webview";
import HTML from "react-native-render-html";
const axios = require("axios");

// Load sample data
import { PlaceListData, ReviewData } from "@data";

class PlaceDetail extends Component {
  constructor(props) {
    super(props);

    const { state } = this.props.navigation;
    let data = state.params;
    // Temp data define

    const fecha = new Date().toISOString();

    // const dias = [
    //   "Domingo",
    //   "Lunes",
    //   "Martes",
    //   "Miércoles",
    //   "Jueves",
    //   "Viernes",
    //   "Sábado",
    //   "Domingo",
    // ];
    const numeroDia = new Date(fecha).getDay() - 1;
    // const nombreDia = dias[numeroDia];

    this.state = {
      numeroDia,
      slideshow: [],
      restaurant_id: data.id,
      workHours: [],
      openHours: [],
      categories: [],
      collapseHour: true,
      index: 0,
      routes: [
        { key: "information", title: "Information" },
        { key: "review", title: "Review" },
        { key: "feedback", title: "Feedback" },
        { key: "map", title: "Map" },
      ],
      heightHeader: Utils.heightHeader(),
      information: [],
      list: [],
      relate: PlaceListData.slice(2, 4),
      facilities: [],
      region: {
        latitude: 1.352083,
        longitude: 103.819839,
        latitudeDelta: 0.009,
        longitudeDelta: 0.004,
      },
    };
    this._deltaY = new Animated.Value(0);

    if (data != null) {
      if (data.id != "") {
      }
    }
  }

  componentDidMount() {
    AsyncStorage.getItem("user_id")
      .then((value) => {
        let credential = {
          id: this.state.restaurant_id,
          user_id: value,
        };
        this.props.actions.details(credential, (response) => {
          if (response.success) {
            let item = response.data.restaurants;

            let info = [
              {
                id: "1",
                icon: "map-marker-alt",
                title: "Direccion",
                type: "map",
                information: item.address,
              },
              {
                id: "2",
                icon: "mobile-alt",
                title: "Tel",
                type: "phone",
                information: item.phone,
              },
              {
                id: "3",
                icon: "envelope",
                title: "Email",
                type: "email",
                information: item.email,
              },
              {
                id: "4",
                icon: "globe",
                title: "Website",
                type: "web",
                information: item.url,
              },
            ];

            this.setState({
              region: {
                latitude: parseFloat(response.data.restaurants.lat),
                longitude: parseFloat(response.data.restaurants.lng),
                latitudeDelta: 0.009,
                longitudeDelta: 0.004,
              },
              information: info,
              slideshow: response.data.restaurants.slideshow,
              list: response.data.restaurants,
              categories: response.data.restaurants.categories,
              workHours: response.data.restaurants.hours,
              openHours: response.data.restaurants.open_hours,
              facilities: response.data.restaurants.facilities,
            });
          } else {
            this.setState({
              loading: false,
            });
            this.props.navigation.goBack();
          }
        });
      })
      .then((res) => {});
  }

  clickFavorite(like) {
    AsyncStorage.getItem("user_id")
      .then((value) => {
        if (value != null) {
          let credential = {
            user_id: value,
            restaurant_id: this.state.restaurant_id,
            like: like,
          };

          this.props.actions.restaurants("like", credential, (response) => {
            if (response.success) {
              let tmp = this.state.list;
              tmp.favorite = response.data.favorite;
              this.setState({ list: tmp });
            } else {
              this.setState({
                loading: false,
              });
            }
          });
        } else {
          this.props.navigation.navigate("SignIn");
        }
      })
      .then((res) => {
        //do something else
      });
  }

  priceRanges(price) {
    let text;

    if (price <= 100) {
      text = "$";
    } else if (price > 100 && price <= 200) {
      text = "$$";
    } else if (price > 200 && price <= 400) {
      text = "$$$";
    } else if (price > 400 && price <= 999) {
      text = "$$$$";
    } else if (price > 1000) {
      text = "$$$$$";
    }

    return (
      <Text headline style={{ color: "#de4217", marginTop: 5 }}>
        {text}
      </Text>
    );
  }

  trimDate(date) {
    let d = date;
    //console.log(d.split(' '));
    return 0;
  }

  onOpen(item) {
    var lat;
    var lng;
    axios
      .get("https://geocoder.ls.hereapi.com/6.2/geocode.json", {
        params: {
          street: item.information,
          gen: "9",
          apiKey: "dEIsx5Dprcd2gW1XcmSjf2_HcZF5lSAvxITwIUeSsFc",
        },
      })
      .then(function(s) {
        //console.log(JSON.parse(s.request._response).Response.View[0].Result[0].Location.DisplayPosition);
        lat = JSON.parse(s.request._response).Response.View[0].Result[0]
          .Location.DisplayPosition.Latitude;
        lng = JSON.parse(s.request._response).Response.View[0].Result[0]
          .Location.DisplayPosition.Longitude;
      })
      .catch(function(e) {
        console.error(e);
      });
    // var scheme = Platform.OS == "ios" ? "maps:" : "geo:";
    var scheme = "https://maps.google.com/?ll=";

    Alert.alert(
      "Donde Comer",
      "Quieres ir a " + item.title + " ?",
      [
        {
          text: "Cancelar",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "OK",
          onPress: () => {
            switch (item.type) {
              case "web":
                Linking.openURL(item.information);
                break;
              case "phone":
                Linking.openURL("tel://" + item.information);
                break;
              case "email":
                Linking.openURL("mailto:" + item.information);
                break;
              case "map":
                //console.log(scheme + lat + ',' + lng);
                Linking.openURL(scheme + lat + "," + lng + "&z=16");
                break;
            }
          },
        },
      ],
      { cancelable: true }
    );
  }

  onCollapse() {
    Utils.enableExperimental();
    this.setState({
      collapseHour: !this.state.collapseHour,
    });
  }

  displayHeart(favorite) {
    if (favorite != 1) {
      //this.state.list.favorite == 1
      return (
        <Icon name="heart" color={BaseColor.lightPrimaryColor} size={24} />
      );
    } else {
      return (
        <Image source={Images.heart} style={styles.logo} resizeMode="contain" />
      );
    }
  }

  render() {
    Geocoder.init("AIzaSyDvaS7W8iRIZTGJ6v5yePMWF4B2sCEVWqg");
    const { navigation } = this.props;
    const {
      heightHeader,
      information,
      workHours,
      openHours,
      numeroDia,
      categories,
      collapseHour,
      list,
      relate,
      facilities,
      slideshow,
      region,
    } = this.state;

    const swiperItems = this.state.slideshow.map((item) => {
      if (Platform.OS === "android") {
        return (
          <TouchableNativeFeedback style={{ flex: 1 }}>
            <Image
              key={item.id}
              source={{ uri: API.URL + item.image }}
              style={{ flex: 1 }}
            />
          </TouchableNativeFeedback>
        );
      } else {
        return (
          <TouchableHighlight style={{ flex: 1 }}>
            <Image
              key={item.id}
              source={{ uri: API.URL + item.image }}
              style={{ flex: 1 }}
            />
          </TouchableHighlight>
        );
      }
    });

    /* const swiperItems = this.state.slideshow.map((item) => {
      return (
        <TouchableNativeFeedback
          onPress={() => {
            //console.log(item.url);
          }}
          style={{ flex: 1 }}
        >
          <Image
            key={item.id}
            source={{ uri: API.URL + item.image }}
            style={{ flex: 1 }}
          />
        </TouchableNativeFeedback>
      );
    }); */

    const heightImageBanner = Utils.scaleWithPixel(250, 1);
    return (
      <View style={{ flex: 1, backgroundColor: "white" }}>
        <SafeAreaView
          style={{ zIndex: 9999, flexDirection: "column" }}
          forceInset={{ top: "always" }}
        >
          <Animated.View
            style={[
              styles.imgBanner,
              {
                flexDirection: "column",
                zIndex: 1,
                height: this._deltaY.interpolate({
                  inputRange: [
                    0,
                    Utils.scaleWithPixel(140),
                    Utils.scaleWithPixel(140),
                  ],
                  outputRange: [heightImageBanner, heightHeader, heightHeader],
                }),
              },
            ]}
          >
            <Swiper
              dotStyle={{
                backgroundColor: BaseColor.textSecondaryColor,
              }}
              key={this.state.slideshow.length}
              activeDotColor={BaseColor.primaryColor}
              paginationStyle={styles.contentPage}
              removeClippedSubviews={false}
              autoplay={true}
              autoplayTimeout={2}
              loop={true}
            >
              {swiperItems}
            </Swiper>
          </Animated.View>
          <Header
            style={{ zIndex: 2 }}
            title=""
            renderLeft={() => {
              return (
                <Icon
                  name="arrow-left"
                  size={20}
                  color={BaseColor.primaryColor}
                />
              );
              ``;
            }}
            // renderRight={() => {
            //   return (
            //     <Icon name="images" size={20} color={BaseColor.whiteColor} />
            //   );
            // }}
            onPressLeft={() => {
              navigation.goBack();
            }}
            // onPressRight={() => {
            //   navigation.navigate("PreviewImage");
            // }}
          />

          <ScrollView
            onScroll={Animated.event([
              {
                nativeEvent: {
                  contentOffset: { y: this._deltaY },
                },
              },
            ])}
            onContentSizeChange={() => {
              this.setState({
                heightHeader: Utils.heightHeader(),
              });
            }}
            scrollEventThrottle={8}
          >
            <View style={{ height: 255 - heightHeader }} />
            <View
              style={{
                paddingHorizontal: 20,
                marginBottom: 20,
              }}
            >
              <View style={styles.lineSpace}>
                <Text title1 semibold>
                  {list.title}
                </Text>

                <TouchableOpacity
                  style={styles.rateLine}
                  onPress={() => this.clickFavorite(list.favorite)}
                >
                  {this.displayHeart(list.favorite)}
                </TouchableOpacity>
              </View>
              <View style={styles.lineSpace}>
                <View>
                  <View style={{ flexDirection: "row" }}>
                    {categories.map((item, index) => {
                      return (
                        <Text caption1 grayColor style={{ marginLeft: 0 }}>
                          {index == 0 ? item.name : " & " + item.name}
                        </Text>
                      );
                    })}
                  </View>

                  <TouchableOpacity
                    style={styles.rateLine}
                    onPress={() =>
                      navigation.navigate("Review", {
                        restaurant_id: this.state.restaurant_id,
                      })
                    }
                  >
                    <Tag
                      rateSmall
                      style={{ marginRight: 5 }}
                      onPress={() =>
                        navigation.navigate("Review", {
                          restaurant_id: this.state.restaurant_id,
                        })
                      }
                    >
                      {list.rate}
                    </Tag>
                    <StarRating
                      disabled={true}
                      starSize={10}
                      maxStars={5}
                      rating={4.5}
                      fullStarColor={BaseColor.yellowColor}
                      on
                    />
                    <Text footnote grayColor style={{ marginLeft: 5 }}>
                      ({list.review})
                    </Text>
                  </TouchableOpacity>
                </View>

                {list.destacado === "1" ? <Tag status>Destacado</Tag> : null}
              </View>
              {information.map((item) => {
                return (
                  <TouchableOpacity
                    style={styles.line}
                    key={item.id}
                    onPress={() => this.onOpen(item)}
                  >
                    <View style={styles.contentIcon}>
                      <Icon
                        name={item.icon}
                        size={16}
                        color={BaseColor.whiteColor}
                      />
                    </View>
                    <View style={{ marginLeft: 10 }}>
                      <Text caption2 grayColor>
                        {item.title}
                      </Text>
                      <Text
                        footnote
                        semibold
                        style={{ marginTop: 5, marginRight: 40 }}
                      >
                        {item.information}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
              <TouchableOpacity
                style={styles.line}
                onPress={() => this.onCollapse()}
              >
                <View style={styles.contentIcon}>
                  <Icon name="clock" size={16} color={BaseColor.whiteColor} />
                </View>
                <View style={styles.contentInforAction}>
                  <View>
                    <Text caption2 grayColor>
                      Horario
                    </Text>
                    <Text footnote semibold style={{ marginTop: 5 }}>
                      {openHours.length > 0
                        ? openHours[numeroDia].day +
                          " : " +
                          openHours[numeroDia].open_hour +
                          " - " +
                          openHours[numeroDia].close_hour
                        : ""}

                      {/* {workHours.length > 0
                        ? workHours[0].start_time + "-" + workHours[0].end_time
                        : ""} */}
                    </Text>
                  </View>
                  <Icon
                    name={collapseHour ? "angle-down" : "angle-up"}
                    size={24}
                    color={BaseColor.grayColor}
                  />
                </View>
              </TouchableOpacity>
              <View
                style={{
                  paddingLeft: 40,
                  paddingRight: 20,
                  marginTop: 5,
                  height: collapseHour ? 0 : null,
                  overflow: "hidden",
                }}
              >
                {openHours.map((item) => {
                  return (
                    <View style={styles.lineWorkHours} key={item.id}>
                      {/* <Text body2 grayColor>
                        {item.start_time}
                      </Text> */}
                      <Text body2 accentColor semibold>
                        {item.day +
                          " : " +
                          item.open_hour +
                          " - " +
                          item.close_hour}
                      </Text>
                    </View>
                  );
                })}
              </View>
            </View>

            <View style={styles.contentDescription}>
              <Text
                title3
                semibold
                style={{
                  paddingTop: 15,
                }}
              >
                Acerca de
              </Text>

              <HTML html={list.description} />

              <View
                style={{
                  paddingVertical: 20,
                  flexDirection: "row",
                  borderBottomWidth: 1,
                  borderColor: BaseColor.textSecondaryColor,
                }}
              >
                <View style={{ flex: 1 }}>
                  <Text caption1 grayColor>
                    Fecha de establecido
                  </Text>
                  <Text headline style={{ marginTop: 5 }}>
                    {list.created_at
                      ? list.created_at.split(" ")[0].trim()
                      : ""}
                  </Text>
                </View>

                <View style={{ flex: 1 }}>
                  <Text caption1 grayColor>
                    Rango de Precios
                  </Text>
                  {this.priceRanges(list.max_price)}
                </View>
              </View>
              <View
                style={{
                  height: 180,
                  paddingVertical: 20,
                }}
              >
                <MapView
                  provider={PROVIDER_GOOGLE}
                  style={styles.map}
                  region={region}
                  onRegionChange={() => {}}
                >
                  <Marker
                    coordinate={{
                      latitude: region.latitude,
                      longitude: region.longitude,
                    }}
                  />
                </MapView>
              </View>
            </View>
            <Text
              title3
              semibold
              style={{
                paddingHorizontal: 20,
                paddingTop: 15,
                paddingBottom: 5,
              }}
            >
              Amenidades
            </Text>
            <View style={styles.wrapContent}>
              {facilities.map((item) => {
                return (
                  <Tag
                    icon={
                      <Image
                        key={item.id}
                        source={{ uri: API.URL + item.image }}
                        style={{
                          width: 13,
                          height: 13,
                          marginLeft: 0,
                          marginRight: 5,
                        }}
                      />
                    }
                    chip
                    key={item.id}
                    style={{
                      marginTop: 10,
                      marginRight: 10,
                    }}
                  >
                    {item.title}
                  </Tag>
                );
              })}
            </View>

            <Text
              title3
              semibold
              style={{
                paddingHorizontal: 20,
                paddingTop: 15,
                paddingBottom: 10,
              }}
            >
              Redes Sociales
            </Text>

            <View style={styles.wrapContentSocial}>
              {list.facebook ? (
                <Icon
                  name="facebook"
                  size={30}
                  color={BaseColor.accentColor}
                  solid
                  style={{ marginHorizontal: 5 }}
                  onPress={() => Linking.openURL(list.facebook)}
                />
              ) : null}

              {list.instagram ? (
                <Icon
                  name="instagram"
                  size={30}
                  color="purple"
                  solid
                  style={{ marginHorizontal: 5 }}
                  onPress={() => Linking.openURL(list.instagram)}
                />
              ) : null}

              {list.twitter ? (
                <Icon
                  name="twitter"
                  size={30}
                  color={BaseColor.accentColor}
                  solid
                  style={{ marginHorizontal: 5 }}
                  onPress={() => Linking.openURL(list.twitter)}
                />
              ) : null}
            </View>

            {/* <Text
              title3
              semibold
              style={{
                paddingHorizontal: 20,
                paddingVertical: 15
              }}
            >
              Related
            </Text>
            <FlatList
              contentContainerStyle={{
                marginHorizontal: 20
              }}
              data={relate}
              keyExtractor={(item, index) => item.id}
              renderItem={({ item, index }) => (
                <CardList                  
                  image={{uri:API.URL + item.image}}
                  title={item.title}
                  subtitle={item.subtitle}
                  rate={item.rate}
                  style={{ marginBottom: 20 }}
                  onPress={() =>
                    navigation.navigate({
                      routeName: "PlaceDetail",
                      key: new Date().toUTCString()
                    })
                  }
                  onPressTag={() => navigation.navigate("Review")}
                />
              )}
            /> */}
          </ScrollView>
        </SafeAreaView>
      </View>
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
)(PlaceDetail);
