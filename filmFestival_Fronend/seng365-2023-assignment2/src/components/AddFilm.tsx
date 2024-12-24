/** @format */

import { useEffect } from "react";

import "react-datepicker/dist/react-datepicker.css";
import FormComp from "./FormComp";

function AddFilm() {
  useEffect(() => {}, []);

  return (
    <div>
      <FormComp filmId={undefined} setting={"create"} film={undefined} />
    </div>
  );
}

export default AddFilm;
