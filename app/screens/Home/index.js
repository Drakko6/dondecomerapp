import React, { Component } from "react";
import * as geolib from "geolib";
import {
  View,
  ScrollView,
  Animated,
  TouchableOpacity,
  FlatList,
  AsyncStorage,
  TextInput,
  Linking,
  AppState,
} from "react-native";
import {
  Image,
  Text,
  Icon,
  Card,
  SafeAreaView,
  Tag,
  CardList,
} from "@components";
import Charging from "@screens/Charging";

import {
  BaseStyle,
  BaseColor,
  BlueColor,
  PinkColor,
  GreenColor,
  YellowColor,
  Images,
} from "@config";

import * as Utils from "@utils";
import styles from "./styles";
import Swiper from "react-native-swiper";
import { HomePopularData } from "@data";
import { SlideShowAction, ResAction } from "@actions";
import * as Actions from "@actions";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as API from "../../config/api";
import { TouchableNativeFeedback } from "react-native";

import RNLocation from "react-native-location";

RNLocation.configure({
  distanceFilter: 100,
});

// RNLocation.configure({
//   desiredAccuracy: {
//     ios: "best",
//     android: "highAccuracy",
//   },
//   interval: 1000,
//   maxWaitTime: 1000,
// });

class Home extends Component {
  constructor(props) {
    super(props);
    // Temp data define
    this.state = {
      search: "",
      banner: [],
      notification: [],
      location: [],
      popular: HomePopularData,
      idxActive: 0,
      heightHeader: Utils.heightHeader(),
      appState: AppState.currentState,
      location: {},
      list: [],
      loading: true,
    };
    this._deltaY = new Animated.Value(0);
  }

  componentDidMount() {
    this.callRestaurants(); // este método podria hacer que se recargue (al final o despues de pedir ubicacion)
    //quiza solo pedir permiso de ubicacion primero
    this.forceUpdate();
    AppState.addEventListener("change", this._handleAppStateChange);
  }

  componentWillUnmount() {
    AppState.removeEventListener("change", this._handleAppStateChange);
  }

  _handleAppStateChange = (nextAppState) => {
    if (
      this.state.appState &&
      this.state.appState.match(/inactive|background/) &&
      nextAppState === "active"
    ) {
      try {
        this.locationSubscription();
      } catch (error) {
        console.log(error);
      }

      if (this.state.permission) {
        this.callRestaurants(nextAppState);
        this.forceUpdate();
      }
      return;
    }
    this.setState({ appState: "background" });
  };

  callRestaurants(nextAppState) {
    this.props.actions.basic("", (response) => {
      if (response.success) {
        for (var i = 0; i < response.data.categories.length; i++) {
          switch (i) {
            case 0:
              response.data.categories[i].color = BaseColor.lightPrimaryColor;
              break;
            case 1:
              response.data.categories[i].color = BaseColor.kashmir;
              break;
            case 2:
              response.data.categories[i].color = PinkColor.primaryColor;
              break;
            case 3:
              response.data.categories[i].color = BlueColor.primaryColor;
              break;
            case 4:
              response.data.categories[i].color = BaseColor.accentColor;
              break;
            case 5:
              response.data.categories[i].color = GreenColor.primaryColor;
              break;
            case 6:
              response.data.categories[i].color = YellowColor.primaryColor;
              break;
            case 7:
              response.data.categories[i].color = BaseColor.kashmir;
              break;
          }
        }
        //recoger la posicion con permisos
        RNLocation.requestPermission({
          ios: "whenInUse",
          android: {
            detail: "coarse",
          },
        }).then((granted) => {
          if (granted) {
            this.locationSubscription = RNLocation.subscribeToLocationUpdates(
              (locations) => {
                nearest = [];
                // Variable con nuestra localizacion
                myLocation = {
                  latitude: locations[0].latitude,
                  longitude: locations[0].longitude,
                };

                // Recorremos los restaurants para sacar su distancia y unirlos en nuevo array
                response.data.res.forEach((res) => {
                  const distance = geolib.getDistance(myLocation, {
                    latitude: parseFloat(res.lat),
                    longitude: parseFloat(res.lng),
                  });

                  const newRes = {
                    ...res,
                    distance,
                  };

                  nearest.push(newRes);
                });

                //  Ordenamos por distancia ascendentemente
                nearestsOrdered = nearest.sort(function(a, b) {
                  return a.distance - b.distance;
                });

                //  Sacamos los primeros 25(más cercanos)
                nearestsOrdered.splice(25);

                this.setState({
                  ...this.state,
                  banner: response.data.slideshow,
                  services: response.data.categories,
                  list: nearestsOrdered,
                  popular: response.data.pop,
                  location: myLocation,
                  appState: nextAppState,
                });
              }
            );
          }
        });
      } else {
        this.setState({
          loading: false,
        });
      }
    });
  }

  renderLocation() {
    const { navigation } = this.props;
    return this.state.location.map((item, i) => {
      return (
        <Tag
          gray
          key={item.id}
          onPress={() => {}}
          style={{
            backgroundColor: BaseColor.fieldColor,
            marginTop: 5,
          }}
        >
          <Text caption2>{item.name}</Text>
        </Tag>
      );
    });
  }

  onSearch(keyword) {
    const { navigation } = this.props;
    const { search, searchHistory } = this.state;

    this.setState({ search: search });
  }

  callFun = () => {
    alert("Image Clicked!!!");
  };

  render() {
    const { navigation } = this.props;

    const {
      banner,
      services,
      popular,
      list,
      heightHeader,
      search,
      notification,
    } = this.state;

    const swiperItems = this.state.banner.map((item) => {
      return (
        <TouchableNativeFeedback
          onPress={() => {
            Linking.openURL(item.url);
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
    });
    const heightImageBanner = Utils.scaleWithPixel(225);
    const marginTopBanner = heightImageBanner - heightHeader + 10;
    this.props.navigation.addListener("didFocus", (payload) => {
      AsyncStorage.setItem("filter", "1");
      AsyncStorage.setItem("notifications_qty", "2");
    });

    return (
      <>
        {this.state.list.length > 0 ? (
          <View style={{ flex: 1, backgroundColor: "transparent" }}>
            <SafeAreaView style={{ flex: 1 }} forceInset={{ top: "always" }}>
              <ScrollView
                // style={{marginTop: marginTopBanner}}
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
                <Animated.View
                  style={[
                    { zIndex: 1 },
                    styles.imageBackground,
                    {
                      height: this._deltaY.interpolate({
                        inputRange: [
                          0,
                          Utils.scaleWithPixel(150),
                          Utils.scaleWithPixel(150),
                        ],
                        outputRange: [heightImageBanner, heightHeader, 0],
                      }),
                    },
                  ]}
                >
                  <Swiper
                    dotStyle={{
                      backgroundColor: BaseColor.textSecondaryColor,
                    }}
                    key={this.state.banner.length}
                    activeDotColor={BaseColor.primaryColor}
                    paginationStyle={styles.contentPage}
                    removeClippedSubviews={false}
                    showsButtons={true}
                    autoplay={true}
                    autoplayTimeout={2}
                    loop={true}
                  >
                    {swiperItems}
                  </Swiper>
                </Animated.View>

                <View
                  style={[
                    styles.searchForm,
                    { zIndex: 9999, marginTop: marginTopBanner },
                  ]}
                >
                  <TouchableOpacity
                    onPress={() => {
                      if (search != "") {
                        navigation.navigate("SearchHistory", { key: search });
                      }
                    }}
                    activeOpacity={0.9}
                  >
                    <View
                      style={[
                        BaseStyle.textInput,
                        {
                          flexDirection: "row",
                          alignItems: "center",
                        },
                      ]}
                    >
                      <TextInput
                        style={[
                          BaseStyle.textInput,
                          { flex: 1, alignItems: "center" },
                        ]}
                        onChangeText={(text) => this.setState({ search: text })}
                        autoCorrect={false}
                        placeholder="Buscar lugar, tipo de comida..."
                        placeholderTextColor={BaseColor.grayColor}
                        value={search}
                        selectionColor={BaseColor.primaryColor}
                        onSubmitEditing={() => {
                          this.onSearch(search);
                        }}
                      />

                      <View style={styles.lineForm} />
                      <Icon
                        name="search"
                        size={18}
                        color={BaseColor.lightPrimaryColor}
                        solid
                      />
                    </View>
                  </TouchableOpacity>

                  {/* <View style={styles.contentLocation}>
        {this.renderLocation()}
      </View> */}
                </View>

                {/* services */}
                <FlatList
                  contentContainerStyle={{ padding: 20 }}
                  data={services}
                  numColumns={4}
                  keyExtractor={(item, index) => item.id}
                  renderItem={({ item }) => {
                    return (
                      <TouchableOpacity
                        style={styles.serviceItem}
                        onPress={() => {
                          navigation.navigate({
                            routeName: "Place",
                            params: {
                              id: item.id,
                              name: item.name,
                              icon: { uri: API.URL + item.image },
                            },
                            key: navigation.key,
                          });
                        }}
                      >
                        <View
                          style={[
                            styles.serviceCircleIcon,
                            { backgroundColor: item.color },
                          ]}
                        >
                          <Image
                            source={{ uri: API.URL + item.image }}
                            style={{ width: 25, height: 25 }}
                          />
                        </View>
                        <Text
                          footnote
                          style={{
                            marginTop: 5,
                            marginBottom: 20,
                            textAlign: "center",
                          }}
                        >
                          {item.name}
                        </Text>
                      </TouchableOpacity>
                    );
                  }}
                />
                <View style={styles.contentPopular}>
                  <Text title3 semibold>
                    {/* Restaurantes populares */}
                    Restaurantes Destacados
                  </Text>
                  <Text body2 grayColor>
                    {/* Lugares favoritos, recommendados */}
                    Descubre nuevos lugares, lo que otros recomiendan
                  </Text>
                </View>

                <FlatList
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                  data={popular}
                  keyExtractor={(item, index) => item.id}
                  renderItem={({ item, index }) => (
                    <Card
                      style={[
                        styles.popularItem,
                        index == 0
                          ? { marginHorizontal: 20 }
                          : { marginRight: 20 },
                      ]}
                      image={{ uri: API.URL + item.img }}
                      onPress={() =>
                        navigation.navigate("PlaceDetail", { id: item.id })
                      }
                    >
                      <Text headline whiteColor semibold>
                        {/* {item.title} */}
                        {item.title}
                      </Text>
                    </Card>
                  )}
                />
                {/* Promotion */}
                <View
                  style={{
                    padding: 20,
                  }}
                >
                  <Text title3 semibold>
                    {/* Recent Location */}
                    Lugares cerca de mí
                  </Text>
                  <Text body2 grayColor>
                    {/* What’s the Worst That Could Happen */}
                    No vayas muy lejos
                  </Text>

                  <FlatList
                    style={{ marginTop: 20 }}
                    data={list}
                    keyExtractor={(item, index) => item.id}
                    renderItem={({ item, index }) => (
                      <CardList
                        image={{ uri: API.URL + item.img }}
                        title={item.title}
                        subtitle={item.phone}
                        rate={item.rate}
                        style={{ marginBottom: 20 }}
                        onPress={() =>
                          navigation.navigate("PlaceDetail", { id: item.id })
                        }
                      />
                    )}
                  />
                </View>
              </ScrollView>
            </SafeAreaView>
          </View>
        ) : (
          <Charging />
        )}
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {};
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(SlideShowAction, dispatch),
    resActions: bindActionCreators(ResAction, dispatch),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home);
