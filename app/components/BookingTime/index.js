import React, { Component } from "react";
import { View, TouchableOpacity } from "react-native";
import PropTypes from "prop-types";
import { Text } from "@components";
import styles from "./styles";
import DateTimePicker from "react-native-modal-datetime-picker";

export default class BookingTime extends Component {
  constructor(props) {
    super(props);
    this.state = {
      markedDates: {},
      checkinTime: this.props.checkinTime,
      checkoutTime: this.props.checkoutTime,
      isDateTimePickerVisible: false,
      isInOut: false,
    };
  }

  showDateTimePicker1 = () => {
    this.setState({ isDateTimePickerVisible: true, isInOut: true });
  };

  showDateTimePicker2 = () => {
    this.setState({ isDateTimePickerVisible: true, isInOut: false });
  };

  hideDateTimePicker = () => {
    this.setState({ isDateTimePickerVisible: false });
  };

  handleDatePicked = (date) => {
    //console.log( this.getTwoNumber(date.getHours()) + ":" + this.getTwoNumber(date.getMinutes()) );
    if (this.state.isInOut) {
      this.setState(
        {
          checkinTime:
            this.getTwoNumber(date.getHours()) +
            ":" +
            this.getTwoNumber(date.getMinutes()),
        },
        () => {
          this.onChange({
            checkInTime: this.state.checkinTime,
            checkOutTime: this.state.checkoutTime,
          });
        }
      );
      this.props.checkInTime =
        this.getTwoNumber(date.getHours()) +
        ":" +
        this.getTwoNumber(date.getMinutes());
    } else {
      this.setState(
        {
          checkoutTime:
            this.getTwoNumber(date.getHours()) +
            ":" +
            this.getTwoNumber(date.getMinutes()),
        },
        () => {
          this.onChange({
            checkInTime: this.state.checkinTime,
            checkOutTime: this.state.checkoutTime,
          });
        }
      );
      this.props.checkOutTime =
        this.getTwoNumber(date.getHours()) +
        ":" +
        this.getTwoNumber(date.getMinutes());
      // this.props.checkOutTime = this.getTwoNumber(date.getHours()) + ":" + this.getTwoNumber(date.getMinutes());
    }
    this.hideDateTimePicker();
  };

  getTwoNumber(value) {
    var number = parseInt(value);
    if (number < 10) {
      //console.log("0" + number);
      return "0" + number;
    }
    return number;
  }

  onChange = (data) => {
    if (this.props.onChange) {
      this.props.onChange(data);
    }
  };

  render() {
    const { style, checkInTime, checkOutTime, onCancel, onChange } = this.props;
    const { isDateTimePickerVisible } = this.state;
    return (
      <View style={[styles.contentPickDate, style]}>
        <DateTimePicker
          mode="time"
          isVisible={isDateTimePickerVisible}
          onConfirm={this.handleDatePicked}
          onCancel={this.hideDateTimePicker}
        />
        <TouchableOpacity
          style={styles.itemPick}
          onPress={this.showDateTimePicker1}
        >
          <Text caption1 light style={{ marginBottom: 5 }}>
            Check In
          </Text>
          <Text headline semibold>
            {checkInTime}
          </Text>
        </TouchableOpacity>
        <View style={styles.linePick} />
        <TouchableOpacity
          style={styles.itemPick}
          onPress={this.showDateTimePicker2}
        >
          <Text caption1 light style={{ marginBottom: 5 }}>
            Check Out
          </Text>
          <Text headline semibold>
            {checkOutTime}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}

BookingTime.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  checkInTime: PropTypes.string,
  checkOutTime: PropTypes.string,
  onCancel: PropTypes.func,
  onChange: PropTypes.func,
};

BookingTime.defaultProps = {
  style: {},
  checkInTime: "09:00",
  checkOutTime: "18:00",
  onCancel: () => {},
  onChange: () => {
    ////console.log("called ok");
    //this.props.onChange(this.state.checkinTime, this.state.checkoutTime);
  },
};
