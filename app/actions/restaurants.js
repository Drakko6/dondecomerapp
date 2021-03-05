import * as actionTypes from "./actionTypes";
import * as API from "../config/api";

export const restaurants = (type, credential, callback) => (dispatch) => {
  //call api and dispatch action case

  const body = credential;
  let url = "";
  if (type == "restaurants") {
    url = API.RES_URL;
  } else if (type == "favorites") {
    url = API.FAVORITE_URL;
  } else if (type == "like") {
    url = API.LIKE_URL;
  } else if (type == "reviews") {
    url = API.REVIEWS_URL;
  } else if (type == "addreview") {
    url = API.ADD_REVIEW_URL;
  } else if (type == "about") {
    url = API.ABOUT_URL;
  }
  const request = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    url: url,
    method: "post",
    body: JSON.stringify(body),
  };

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

export const search = (credential, callback) => (dispatch) => {
  //call api and dispatch action case

  //console.log(API.SEARCH_URL);

  const body = credential;
  const request = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    url: `${API.SEARCH_URL}`,
    method: "post",
    body: JSON.stringify(body),
  };

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

export const searchbyname = (credential, callback) => (dispatch) => {
  //call api and dispatch action case

  const body = credential;
  const request = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    url: `${API.G_SEARCH_URL}`,
    method: "post",
    body: JSON.stringify(body),
  };

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

export const details = (credential, callback) => (dispatch) => {
  //call api and dispatch action case
  //console.log(API.DETAILS_URL);
  const body = credential;
  const request = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },

    url: `${API.DETAILS_URL}`,
    method: "post",
    body: JSON.stringify(body),
  };

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
