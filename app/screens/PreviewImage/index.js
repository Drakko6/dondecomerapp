import React, { Component } from "react";
import { View, FlatList, TouchableOpacity } from "react-native";
import { BaseStyle, BaseColor, Images } from "@config";
import Swiper from "react-native-swiper";
import { Image, Header, SafeAreaView, Icon, Text } from "@components";
import styles from "./styles";

export default class PreviewImage extends Component {
  constructor(props) {
    super(props);

    // Temp data images define
    this.state = {
      images: [
        { id: "1", image: Images.location1, selected: true },
        { id: "2", image: Images.location2 },
        { id: "3", image: Images.location3 },
        { id: "4", image: Images.location4 },
        { id: "5", image: Images.location5 },
        { id: "6", image: Images.location6 },
        { id: "7", image: Images.location7 }
      ],
      indexSelected: 0
    };
    this.flatListRef = null;
    this.swiperRef = null;
  }

  onSelect(indexSelected) {
    this.setState(
      {
        indexSelected: indexSelected,
        images: this.state.images.map((item, index) => {
          if (index == indexSelected) {
            return {
              ...item,
              selected: true
            };
          } else {
            return {
              ...item,
              selected: false
            };
          }
        })
      },
      () => {
        this.flatListRef.scrollToIndex({
          animated: true,
          index: indexSelected
        });
      }
    );
  }

  /**
   * @description Called when image item is selected or activated
   * @author Passion UI <passionui.com>
   * @date 2019-09-01
   * @param {*} touched
   * @returns
   */
  onTouchImage(touched) {
    if (touched == this.state.indexSelected) return;
    this.swiperRef.scrollBy(touched - this.state.indexSelected, false);
  }

  render() {
    const { navigation } = this.props;
    const { images, indexSelected } = this.state;
    return (
      <SafeAreaView
        style={[BaseStyle.safeAreaView, { backgroundColor: "black" }]}
        forceInset={{ top: "always" }}
      >
        <Header
          style={{ backgroundColor: "black" }}
          title=""
          renderRight={() => {
            return <Icon name="times" size={20} color={BaseColor.whiteColor} />;
          }}
          onPressRight={() => {
            navigation.goBack();
          }}
          barStyle="light-content"
        />
        <Swiper
          ref={ref => {
            this.swiperRef = ref;
          }}
          dotStyle={{
            backgroundColor: BaseColor.textSecondaryColor
          }}
          paginationStyle={{ bottom: 0 }}
          loop={false}
          activeDotColor={BaseColor.primaryColor}
          removeClippedSubviews={false}
          onIndexChanged={index => this.onSelect(index)}
        >
          {images.map((item, key) => {
            return (
              <Image
                key={key}
                style={{ width: "100%", height: "100%" }}
                resizeMode="contain"
                source={item.image}
              />
            );
          })}
        </Swiper>
        <View
          style={{
            paddingVertical: 10
          }}
        >
          <View style={styles.lineText}>
            <Text body2 whiteColor>
              Standard Double Room
            </Text>
            <Text body2 whiteColor>
              {indexSelected + 1}/{images.length}
            </Text>
          </View>
         
        </View>
      </SafeAreaView>
    );
  }
}
