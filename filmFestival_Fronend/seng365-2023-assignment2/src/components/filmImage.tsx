/** @format */

import { useState, useEffect } from "react";
import { fetchFilmImage } from "../utils/filmsRequest";
import { Card } from "react-bootstrap";
function FilmPictureComp(filmId: any) {
  const [filmPicture, setFilmPicture] = useState<string>("");
  useEffect(() => {
    fetchFilmImage(filmId.filmId)
      .then((response) => {
        setFilmPicture(response);
      })
      .catch((error) => {
        console.error("Error fetching film image:", error);
        setFilmPicture("");
      });
  }, [filmId]);

  return (
    <Card.Img
      className="fluid"
      variant="top"
      //   width={300}
      //   height={310}
      src={filmPicture}
    />
  );
}
export default FilmPictureComp;
