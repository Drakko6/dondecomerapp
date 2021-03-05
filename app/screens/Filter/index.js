import React, { Component } from "react";
import {
  View,
  FlatList,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image,
  AsyncStorage,
} from "react-native";
import { BaseStyle, BaseColor } from "@config";
import {
  Header,
  SafeAreaView,
  Icon,
  Text,
  Tag,
  BookingTime,
  StarRating,
} from "@components";
import RangeSlider from "rn-range-slider";
import * as Utils from "@utils";
import styles from "./styles";

import { FilterAction } from "@actions";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as API from "../../config/api";

class Filter extends Component {
  constructor(props) {
    super(props);

    // Temp data define
    this.state = {
      category_id: "",
      priceBegin: 0,
      priceEnd: 100,
      rate: 5,
      search: "",
      city_id: [],
      category: [],
      facilities: [],
      interio: [
        { id: "1", name: "1", color: "#FD5739", checked: true },
        { id: "2", name: "2", color: "#C31C0D" },
        { id: "3", name: "3", color: "#FF8A65" },
        { id: "4", name: "4", color: "#4A90A4" },
        { id: "5", name: "5", color: "#212121" },
      ],
      location: [],
      area: [],
      scrollEnabled: true,
    };

    // get faicilities
    // initialize category part
    this.props.actions.facilities("", (response) => {
      if (response.success) {
        this.setState({
          facilities: response.data.facilities,
          category: response.data.categories,
        });
        AsyncStorage.setItem(
          "facilities",
          JSON.stringify(response.data.facilities)
        );
        AsyncStorage.setItem(
          "categories",
          JSON.stringify(response.data.categories)
        );
      } else {
        this.setState({
          loading: false,
        });
      }
    });
  }

  /**
   * @description export text location
   * @author Passion UI <passionui.com>
   * @date 2020-02-01
   * @param {*} select
   */
  renderTextFromList(list) {
    let listString = [];
    let city_ids = [];
    listString = list.map((item) => {
      return item.city_name;
    });

    return listString.join(",");
  }

  /**
   * @description Called when filtering option > location
   * @author Passion UI <passionui.com>
   * @date 2020-02-01
   * @param {*} select
   */
  onNavigateLocation() {
    const { navigation } = this.props;
    const { location } = this.state;
    navigation.navigate("ChooseLocation", {
      onApply: (data) => {
        city_ids = data.map((item) => {
          return item.id;
        });
        //console.log(city_ids);

        this.setState({
          location: data,
          city_id: city_ids.join(","),
        });
      },
      selected: location,
    });
  }

  /**
   * @description Called when filtering option > area
   * @author Passion UI <passionui.com>
   * @date 2020-02-01
   * @param {*} select
   */

  /**
   * @description Called when filtering option > category
   * @author Passion UI <passionui.com>
   * @date 2019-09-01
   * @param {*} select
   */
  onSelectCategory(select) {
    this.setState({
      category: this.state.category.map((item) => {
        if (item.name == select.name) {
          return {
            ...item,
            checked: true,
          };
        } else {
          return {
            ...item,
            checked: false,
          };
        }
      }),
      category_id: select.id,
      category_name: select.name,
    });
  }

  /**
   * @description Called when filtering option > Facilities
   * @author Passion UI <passionui.com>
   * @date 2019-09-01
   * @param {*} select
   */
  onSelectFacilities(select) {
    //console.log(select.title);
    this.setState({
      facilities: this.state.facilities.map((item) => {
        if (item.title == select.title) {
          return {
            ...item,
            checked: true,
          };
        } else {
          return {
            ...item,
            checked: false,
          };
        }
      }),
      facility_id: select.id,
    });
  }

  /**
   * @description Called when filtering option > Interio
   * @author Passion UI <passionui.com>
   * @date 2019-09-01
   * @param {*} select
   */

  render() {
    const { navigation } = this.props;
    const {
      search,
      category,
      facilities,
      interio,
      priceBegin,
      priceEnd,
      rate,
      scrollEnabled,
      location,
      area,
    } = this.state;
    return (
      <SafeAreaView
        style={[
          BaseStyle.safeAreaView,
          { backgroundColor: BaseColor.whiteColor },
        ]}
        forceInset={{ top: "always" }}
      >
        <Header
          title="Filtrar"
          renderLeft={() => {
            return (
              <Icon name="times" size={20} color={BaseColor.primaryColor} />
            );
          }}
          renderRight={() => {
            return (
              <Text headline primaryColor numberOfLines={1}>
                Aplicar{" "}
              </Text>
            );
          }}
          onPressLeft={() => navigation.goBack()}
          onPressRight={() => {
            navigation.navigate("Place", { data: this.state });
          }}
        />

        <ScrollView
          scrollEnabled={scrollEnabled}
          onContentSizeChange={(contentWidth, contentHeight) =>
            this.setState({
              scrollEnabled: Utils.scrollEnabled(contentWidth, contentHeight),
            })
          }
        >
          <View style={{ paddingHorizontal: 20, paddingTop: 10 }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 20,
              }}
            >
              <TextInput
                style={BaseStyle.textInput}
                onChangeText={(text) => this.setState({ search: text })}
                autoCorrect={false}
                placeholder="Buscar..."
                placeholderTextColor={BaseColor.grayColor}
                value={search}
                selectionColor={BaseColor.primaryColor}
                onSubmitEditing={() => {}}
              />
              <TouchableOpacity
                onPress={() => {
                  this.setState({
                    search: "",
                  });
                }}
                style={styles.btnClearSearch}
              >
                <Icon name="times" size={18} color={BaseColor.grayColor} />
              </TouchableOpacity>
            </View>

            <Text headline semibold>
              Categoría
            </Text>
            <View style={styles.wrapContent}>
              {category.map((item) => {
                return (
                  <Tag
                    primary={item.checked}
                    outline={!item.checked}
                    key={item.id}
                    style={{
                      marginTop: 10,
                      marginRight: 10,
                    }}
                    onPress={() => this.onSelectCategory(item)}
                  >
                    {item.name}
                  </Tag>
                );
              })}
            </View>

            <Text headline semibold style={{ marginTop: 20 }}>
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

                      // <Icon
                      //   name={item.icon}
                      //   size={12}
                      //   color={BaseColor.accentColor}
                      //   solid
                      //   style={{ marginRight: 5 }}
                      // />
                    }
                    chip
                    key={item.id}
                    style={{
                      marginTop: 10,
                      marginRight: 10,
                    }}
                    onPress={() => this.onSelectFacilities(item)}
                  >
                    {item.title}
                  </Tag>
                );
              })}
            </View>

            <TouchableOpacity
              style={styles.locationContent}
              onPress={() => this.onNavigateLocation()}
            >
              <View>
                <Text headline semibold>
                  Ciudad
                </Text>
                {location.length > 0 ? (
                  <Text footnote primaryColor style={{ marginTop: 5 }}>
                    {this.renderTextFromList(location)}
                  </Text>
                ) : (
                  <Text footnote grayColor style={{ marginTop: 5 }}>
                    Selecciona
                  </Text>
                )}
              </View>
              <Icon name="angle-right" size={18} color={BaseColor.grayColor} />
            </TouchableOpacity>

            <Text headline semibold style={{ marginTop: 20 }}>
              Precio
            </Text>
            <View style={styles.contentRange}>
              <Text caption1 grayColor>
                $0
              </Text>
              <Text caption1 grayColor>
                $100
              </Text>
            </View>
            <RangeSlider
              style={{
                width: "100%",
                height: 40,
              }}
              thumbRadius={12}
              lineWidth={5}
              gravity={"center"}
              labelStyle="none"
              min={0}
              max={1000}
              step={1}
              selectionColor={BaseColor.primaryColor}
              blankColor={BaseColor.textSecondaryColor}
              onValueChanged={(low, high, fromUser) => {
                this.setState({
                  priceBegin: low,
                  priceEnd: high,
                });
              }}
              onTouchStart={() => {
                this.setState({
                  scrollEnabled: false,
                });
              }}
              onTouchEnd={() => {
                this.setState({
                  scrollEnabled: true,
                });
              }}
            />
            <View style={styles.contentResultRange}>
              <Text caption1>Precio Promedio</Text>
              <Text caption1>
                ${priceBegin} - ${priceEnd}
              </Text>
            </View>
          </View>

          <View style={{ paddingHorizontal: 20, marginTop: 20 }}>
            <Text headline semibold style={{ marginBottom: 10 }}>
              Horario
            </Text>

            <BookingTime
              checkInTime={this.state.checkInTime}
              checkOutTime={this.state.checkOutTime}
              onChange={(data) => {
                this.setState({
                  checkInTime: data.checkInTime,
                  checkOutTime: data.checkOutTime,
                });
                //console.log("called");
              }}
            />
          </View>

          <View style={{ paddingHorizontal: 20, marginVertical: 20 }}>
            <Text headline semibold>
              Calificación
            </Text>
            <View style={{ width: 160, marginTop: 10 }}>
              <StarRating
                starSize={26}
                maxStars={5}
                rating={rate}
                selectedStar={(rate) => this.setState({ rate })}
                fullStarColor={BaseColor.yellowColor}
              />
            </View>
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
    actions: bindActionCreators(FilterAction, dispatch),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Filter);
