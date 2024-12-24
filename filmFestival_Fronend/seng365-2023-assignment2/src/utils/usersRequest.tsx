/** @format */
import { Films } from "../types/films";
import axios from "axios";
import Cookies from "js-cookie";
import { NameType } from "../types/users";

export const fetchUserImage = (userId: number): Promise<string> => {
  return axios
    .get(`http://localhost:4941/api/v1/users/${userId}/image`)
    .then((response) => {
      return `http://localhost:4941/api/v1/users/${userId}/image`;
    })
    .catch((error) => {
      return require("../storage/noProfile.png");
    });
};

export const isLoggedIn = (): boolean => {
  const userToken = Cookies.get("UserToken");

  if (userToken === undefined || userToken === null) {
    return false;
  } else {
    return true;
  }
};

export const postLogin = async (email: string, password: string) => {
  return await axios
    .post(`http://localhost:4941/api/v1/users/login`, {
      email: email,
      password: password,
    })
    .then((response) => {
      if (response.status === 200) {
        Cookies.set("UserId", response.data.userId);
        Cookies.set("UserToken", response.data.token);
      }
      return response;
    })
    .catch((error) => {
      return error.response;
    });
};

export const getProfilePhoto = async (): Promise<string> => {
  if (!isLoggedIn()) return "";
  const userId = parseInt((Cookies.get("UserId") as string) || "") || undefined;

  return await axios
    .get(`http://localhost:4941/api/v1/users/${userId}/image`)
    .then((response) => {
      return `http://localhost:4941/api/v1/users/${userId}/image`;
    })
    .catch((error) => {
      return require("../storage/noProfile.png");
    });
};

export const uploadProfilePhoto = async (photo: any) => {
  const userId = parseInt((Cookies.get("UserId") as string) || "") || undefined;
  const photoType = photo.type;
  const config = {
    headers: {
      "content-type": photoType,
      "X-Authorization": Cookies.get("UserToken") || "",
    },
  };

  return await axios
    .put(`http://localhost:4941/api/v1/users/${userId}/image`, photo, config)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
};

export const deleteProfilePhoto = async () => {
  const userId = parseInt((Cookies.get("UserId") as string) || "") || undefined;

  const config = {
    headers: {
      "X-Authorization": Cookies.get("UserToken") || "",
    },
  };

  return await axios
    .delete(`http://localhost:4941/api/v1/users/${userId}/image`, config)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
};

export const getProfileImage = async (id: number): Promise<string> => {
  return await axios
    .get(`http://localhost:4941/api/v1/users/${id}/image`)
    .then((response) => {
      return `http://localhost:4941/api/v1/users/${id}/image`;
    })
    .catch((error) => {
      return require("../storage/noProfile.png");
    });
};

export const PatchUser = async (
  firstName: string,
  lastName: string,
  email: string,
  password?: string,
  currentPassword?: string
) => {
  if (!isLoggedIn()) return undefined;
  const userId = parseInt((Cookies.get("UserId") as string) || "") || undefined;

  let body;
  if (password !== undefined && password.length > 0) {
    body = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: password,
      currentPassword: currentPassword,
    };
  } else {
    body = {
      firstName: firstName,
      lastName: lastName,
      email: email,
    };
  }

  const config = {
    headers: {
      "X-Authorization": Cookies.get("UserToken") || "",
    },
  };

  return await axios
    .patch(`http://localhost:4941/api/v1/users/${userId}`, body, config)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
};

export const getUser = (id: string | undefined): Promise<NameType> => {
  return axios.get("http://localhost:4941/api/v1/users/" + id).then(
    (response) => {
      return response.data;
    },
    (error) => {
      console.log(error);
    }
  );
};

export const getProfileData = async () => {
  const userId = parseInt((Cookies.get("UserId") as string) || "") || undefined;

  const config = {
    headers: {
      "X-Authorization": Cookies.get("UserToken") || "",
    },
  };

  const response = await axios.get(
    `http://localhost:4941/api/v1/users/${userId}`,
    config
  );
  return response.data;
};
