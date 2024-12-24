/** @format */
import Cookies from "js-cookie";
import {
  Films,
  filmSearchQuery,
  FetchFilmsResponse,
  genre,
  SimilarFilmSearchQuery,
} from "../types/films";
import axios from "axios";

export const fetchFilms = (
  searchQuery: filmSearchQuery
): Promise<FetchFilmsResponse> => {
  return axios
    .get("http://localhost:4941/api/v1/films", { params: searchQuery })
    .then(
      (response) => {
        return response.data;
      },
      (error) => {}
    );
};

export const fetchSimilarFilms = (searchQuery: SimilarFilmSearchQuery) => {
  return axios
    .get(`http://localhost:4941/api/v1/films`, { params: searchQuery })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error("Error fetching films:", error);
      throw error;
    });
};

export const fetchFilmImage = (filmId: number): Promise<string> => {
  return axios
    .get(`http://localhost:4941/api/v1/films/${filmId}/image`)
    .then((response) => {
      return `http://localhost:4941/api/v1/films/${filmId}/image`;
    })
    .catch((error) => {
      return require("../storage/no_image.png");
    });
};

export const fetchFilm = (filmId: string | undefined): Promise<any> => {
  return axios.get(`http://localhost:4941/api/v1/films/` + filmId).then(
    (response) => {
      console.log("from fetch film by id ", response.data);
      return response.data;
    },
    (error) => {}
  );
};

export const fetchFilmGenre = (): Promise<genre[]> => {
  return axios.get(`http://localhost:4941/api/v1/films/genres/`).then(
    (response) => {
      return response.data;
    },
    (error) => {}
  );
};

export const PostFilms = async (body: any) => {
  const config = {
    headers: {
      "X-Authorization": Cookies.get("UserToken") || "",
    },
  };

  const response = await axios
    .post(`http://localhost:4941/api/v1/films`, body, config)
    .catch((error) => {
      return error.response;
    });
  return response;
};

export const writeReview = async (
  filmId: number,
  userId: number,
  review: string,
  rating: number
) => {
  const config = {
    headers: {
      "X-Authorization": Cookies.get("UserToken") || "",
    },
  };

  const response = await axios
    .post(
      `http://localhost:4941/api/v1/films/${filmId}/reviews`,
      {
        userId: userId,
        review: review,
        rating: rating,
      },
      config
    )
    .catch((error) => {
      return error.response;
    });
  return response.statusText;
};
export const getReviews = async (filmId: number) => {
  console.log("reviews from axios: ", filmId);
  const response = await axios.get(
    `http://localhost:4941/api/v1/films/${filmId}/reviews`
  );
  console.log("reviews from axios: ", response.data);
  return response.data;
};

export const patchFilm = async (filmId: number, body: any) => {
  console.log("from patchfilm axios ", filmId, body);
  const query = {
    headers: {
      "X-Authorization": Cookies.get("UserToken") || "",
    },
  };

  const response = await axios
    .patch(`http://localhost:4941/api/v1/films/${filmId}`, body, query)
    .catch((error) => {
      return error.response;
    });
  return response;
};

export const deleteFilm = async (filmId: number) => {
  const query = {
    headers: {
      "X-Authorization": Cookies.get("UserToken") || "",
    },
  };

  const response = await axios.delete(
    `http://localhost:4941/api/v1/films/${filmId}`,
    query
  );
  return response;
};

export const uploadFilmPhoto = async (filmId: number, photo: any) => {
  let photoType = photo.type;
  if (photoType === "image/jpg") photoType = "image/jpeg";

  const query = {
    headers: {
      "content-type": photoType,
      "X-Authorization": Cookies.get("UserToken") || "",
    },
  };

  return await axios
    .put(`http://localhost:4941/api/v1/films/${filmId}/image`, photo, query)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
};
