import * as actionTypes from "./actionTypes";
import * as API from "../config/api";

export const facilities = (credential, callback) => (dispatch) => {
  //console.log(API.FACILITY_URL);
  const body = credential;
  const request = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    url: `${API.FACILITY_URL}`,
    method: "get",
  };
  // body: JSON.stringify(body),

  fetch(request.url, request).then((res) => {
    if (res.ok) {
      res.json().then((response) => {
        if (typeof callback === "function") {
          callback({ success: true, data: response });
        }
      });
    } else {
      dispatch({ type: actionTypes.LOGIN_ERROR });
    }
  });
};

export const basic = (credential, callback) => (dispatch) => {
  //call api and dispatch action case

  //console.log(AP=I.BASIC_URL);
  const body = credential;
  const request = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    url: `${API.BASIC_URL}`,
    method: "get",
  };
  // body: JSON.stringify(body),

  fetch(request.url, request).then((res) => {
    if (res.ok) {
      res.json().then((response) => {
        if (typeof callback === "function") {
          callback({ success: true, data: response });
        }
      });
    } else {
      dispatch({ type: actionTypes.LOGIN_ERROR });
    }
  });
};
