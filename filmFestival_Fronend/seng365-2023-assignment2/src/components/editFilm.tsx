/** @format */

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Films } from "../types/films";
import { fetchFilm } from "../utils/filmsRequest";
import FormComp from "./FormComp";

function EditFilm() {
  const { id } = useParams();
  console.log("From edit film is it userId or filmId: ", id);
  let filmId;
  if (id !== undefined) {
    filmId = parseInt(id);
  }

  useEffect(() => {
    const dummy = async () => {};
    dummy();
  }, []);
  return (
    <div>
      <FormComp filmId={filmId} setting={"edit"} />
    </div>
  );
}

export default EditFilm;
