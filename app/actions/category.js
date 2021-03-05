import * as actionTypes from "./actionTypes";
import * as API from "../config/api";

export const categories = (credential, callback) => (dispatch) => {
  //call api and dispatch action case

  //console.log(API.CAT_URL);
  const body = credential;
  const request = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    url: `${API.CAT_URL}`,
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
