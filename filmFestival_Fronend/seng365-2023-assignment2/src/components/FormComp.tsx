/** @format */

import { useState, useEffect, ChangeEvent, SetStateAction } from "react";
import {
  Button,
  Form,
  Row,
  Col,
  Nav,
  NavItem,
  FloatingLabel,
} from "react-bootstrap";
import { NavLink, useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import {
  patchFilm,
  fetchFilmGenre,
  PostFilms,
  uploadFilmPhoto,
  fetchFilm,
  fetchFilmImage,
} from "../utils/filmsRequest";
import { Films } from "../types/films";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import { genre } from "../types/films";
const ageRatings = ["G", "PG", "R18", "R16", "M", "R13"];

function FormComp(props: any) {
  const { id } = useParams();
  //directorId, title, description, releaseDate, ageRating, genreId, runtime
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [directorId, setDirectorId] = useState(0);
  const [releaseDate, setReleaseDate] = useState<Date | null>(new Date());
  const [ageRating, setAgeRating] = useState("");
  const [genreId, setGenreId] = useState<number | null>(null);
  const [genres, setGenres] = useState<genre[]>([]);
  const [runtime, setRuntime] = useState(0);
  const [image, setImage] = useState<any>(null);

  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleChangeSelectGenre = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedGenreId =
      event.target.value === "" ? null : parseInt(event.target.value, 10);
    console.log("genre ", selectedGenreId);
    setGenreId(selectedGenreId);
  };

  const handleChangeSelectAge = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    console.log("ageRating ", event.target.value);
    setAgeRating(event.target.value);
  };
  const handleSubmit = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();
    function GetFormattedDate(date: Date | null | undefined) {
      if (date === null || date === undefined) return;
      else {
        var month = ("0" + (date.getMonth() + 1)).slice(-2);
        var day = ("0" + date.getDate()).slice(-2);
        var year = date.getFullYear();
        var hour = ("0" + date.getHours()).slice(-2);
        var min = ("0" + date.getMinutes()).slice(-2);
        var sec = ("0" + date.getSeconds()).slice(-2);
      }
      return `${year}-${month}-${day} ${hour}:${min}:${sec}`;
    }

    const formattedDate = GetFormattedDate(releaseDate);

    let reqBody;
    reqBody = {
      title: title,
      description: description,
      releaseDate: formattedDate,
      genreId: genreId,
      ageRating: ageRating,
      runtime: runtime,
    };

    if (props.setting === "create") {
      console.log("requestBody", reqBody);
      const response = await PostFilms(reqBody);
      console.log("from create a film", response.data.filmId);
      if (response.status !== 201) {
        setError(response.statusText);
      } else {
        if (image !== null) {
          // const fileObject = fileInput.target.files[0];
          const imageResponse = await uploadFilmPhoto(
            response.data.filmId,
            image.target.files[0]
          );
          console.log(
            "from create a film image response: ",
            imageResponse.status
          );

          if (imageResponse.status !== 201) {
            setError(imageResponse.statusText);
          } else {
            navigate("/myFilms");
          }
        } else {
          navigate("/myFilms");
        }
      }
    }
    if (props.setting === "edit") {
      console.log("props ", props);
      const response = await patchFilm(props.filmId, reqBody);
      if (response.status !== 200) {
        setError(response.statusText);
      }
      if (image !== null) {
        // const fileObject = fileInput.target.files[0];
        const imageResponse = await uploadFilmPhoto(
          props.filmId,
          image.target.files[0]
        );

        if (response.status !== 200) {
          setError(response.statusText);
        } else if (
          imageResponse.status !== 201 &&
          imageResponse.status !== 200
        ) {
          setError(imageResponse.statusText);
        } else {
          navigate("/myFilms");
        }
      } else {
        if (response.status === 200) {
          navigate("/myFilms");
        }
      }
    }
  };

  const handleCancel = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();
    navigate("/MyFilms");
  };

  useEffect(() => {
    const dummy = async () => {
      const genresData: genre[] = await fetchFilmGenre();
      setGenres(genresData);
    };
    dummy();
  }, []);
  useEffect(() => {
    const fetchFilmData = async () => {
      // Fetch the film data using the film ID
      const filmData = await fetchFilm(props.filmId); // Replace fetchFilmById with the actual function to fetch film data by ID
      const filmImage = await fetchFilmImage(props.filmId);
      // Populate the form fields with the fetched film data
      setTitle(filmData.title);
      setDescription(filmData.description);
      setDirectorId(filmData.directorId);
      setReleaseDate(new Date(filmData.releaseDate));
      setAgeRating(filmData.ageRating);
      setGenreId(filmData.genreId);
      setRuntime(filmData.runtime);
    };

    if (props.setting === "edit") {
      fetchFilmData();
    }
  }, [props.filmId, props.setting]);

  return (
    <Row xs={1} md={3}>
      <Col></Col>

      <Col>
        <Form className="border border-dark bg-light p-4 m-4">
          <Form.Group className="mb-3">
            <Nav className="md">
              {props.setting === "create" ? "Add film" : "Edit film"}
            </Nav>
          </Form.Group>
          <Form.Group controlId="formFile" className="mb-3">
            <Form.Label>Upload Photo</Form.Label>
            <Form.Control type="file" onChange={(e) => setImage(e)} />
          </Form.Group>
          <Row>
            <Col>
              <Form.Group className="mb-3" controlId="formBasicEndDate">
                <Form.Label>Select Release Date</Form.Label>

                <DatePicker
                  selected={releaseDate}
                  onChange={(date: Date) => setReleaseDate(date)}
                  showTimeSelect
                  timeFormat="HH:mm"
                  timeIntervals={15}
                  timeCaption="Time"
                  dateFormat="yyyy MMMM d, HH:mm"
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group className="mb-3" controlId="formBasicRuntime">
                <FloatingLabel
                  className="mb-3"
                  label="runtime"
                  controlId="floatingInput"
                >
                  <Form.Control
                    type="runtime"
                    defaultValue={runtime}
                    isValid={runtime > 0}
                    onChange={(e) => setRuntime(parseInt(e.target.value, 10))}
                  />
                </FloatingLabel>
              </Form.Group>
            </Col>
          </Row>{" "}
          <Form.Group className="mb-3" controlId="formBasicTitle">
            <FloatingLabel
              className="mb-3"
              label="title"
              controlId="floatingInput"
            >
              <Form.Control
                type="title"
                defaultValue={title}
                isValid={title.length > 0}
                onChange={(e) => setTitle(e.target.value)}
              />
            </FloatingLabel>
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicdescription">
            <FloatingLabel
              className="mb-3"
              label="description"
              controlId="floatingInput"
            >
              <Form.Control
                type="description"
                defaultValue={description}
                isValid={description.length > 0}
                onChange={(e) => setDescription(e.target.value)}
              />
            </FloatingLabel>
          </Form.Group>
          <Row>
            <Col>
              <Form.Select
                className="form-control form-control"
                size="sm"
                value={genreId !== null ? genreId.toString() : ""}
                onChange={handleChangeSelectGenre}
              >
                <option value="">Select a genre</option>
                {genres.map((item: genre) => (
                  <option key={item.genreId} value={item.genreId}>
                    {item.name}
                  </option>
                ))}
              </Form.Select>
            </Col>

            <Col>
              <Form.Select
                className="form-control form-control"
                size="sm"
                value={ageRating !== null ? ageRating : ""}
                onChange={handleChangeSelectAge}
              >
                <option value="">Select age rating</option>
                {ageRatings.map((ageRating: string) => (
                  <option key={ageRating} value={ageRating}>
                    {ageRating}
                  </option>
                ))}
              </Form.Select>
            </Col>
          </Row>
          <Row>
            <Col>
              <Button
                variant="success"
                type="submit"
                onClick={(e) => handleSubmit(e)}
              >
                {props.setting === "create" ? "Create" : "Edit"}
              </Button>
            </Col>
            <Col>
              <Button
                variant="primary"
                type="submit"
                onClick={(e) => handleCancel(e)}
              >
                Cancel
              </Button>
            </Col>
          </Row>
          <Form.Group className="mb-3" controlId="formBasicLabel">
            <Form.Label className="text-danger">{error}</Form.Label>
          </Form.Group>
        </Form>
      </Col>

      <Col></Col>
    </Row>
  );
}

export default FormComp;
