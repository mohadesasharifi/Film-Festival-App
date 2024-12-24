/** @format */

import axios from "axios";
import Cookies from "js-cookie";

export const Postlogout = () => {
  const config = {
    headers: {
      "content-type": "application/json",
      "X-Authorization": Cookies.get("UserToken") || "",
    },
  };
  return axios
    .post(`http://localhost:4941/api/v1/users/logout`, {}, config)
    .then((response) => {
      if (response.status === 200) {
        Cookies.remove("UserId", response.data.userId);
        Cookies.remove("UserToken", response.data.token);
      }
      return response;
    })
    .catch((error) => {
      return error.response.status;
    });
};
