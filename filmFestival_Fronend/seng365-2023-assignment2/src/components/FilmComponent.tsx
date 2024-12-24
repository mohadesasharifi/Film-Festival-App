/** @format */
import React, { useEffect, useState } from "react";
import {
  deleteFilm,
  fetchFilm,
  fetchFilmGenre,
  fetchFilms,
  getReviews,
} from "../utils/filmsRequest";

import FilmCard from "./FilmCard";
import {
  Film,
  Films,
  SimilarFilmSearchQuery,
  filmSearchQuery,
  genre,
  reviewResponse,
} from "../types/films";
import { Link, useParams } from "react-router-dom";
import { Card, Row, Col, Badge, Button, Modal } from "react-bootstrap";
import FilmPictureComp from "./filmImage";
import { convertToNZDate } from "../utils/formatDate";
import ProfilePictureComp from "./ProfileImageComp";
import FilmRating from "./RatingComponent";
import Rating from "react-rating-stars-component";
import { SimilarFilmComponent } from "./SimilarFilms";
import ReviewList from "./reviewList";
import { useNavigate } from "react-router-dom";
import { now } from "moment-timezone";
import moment from "moment";
import Cookies from "js-cookie";
import ReviewForm from "./addReview";

export function FilmComponent() {
  const { id } = useParams();
  const [film, setFilm] = useState<Film | null>(null);
  const [ageRating, setAgeRating] = useState<Array<string>>([]);
  const [description, setDescription] = useState("");
  const [directorFirstName, setDirectorFirstName] = useState("");
  const [directorId, setDirectorId] = useState(0);
  const [directorLastName, setDirectorLastName] = useState("");
  const [filmId, setFilmId] = useState(0);
  const [genreIds, setGenreIds] = useState(0);
  const [numReviews, setNumReviews] = useState(0);
  const [reviews, setReviews] = useState<reviewResponse[]>([]);
  const [rating, setRating] = useState<number | null>(null);
  const [releaseDate, setReleaseDate] = useState("");
  const [runtime, setRuntime] = useState(0);
  const [title, setTitle] = useState("");
  const [genre, setGenre] = useState<genre[]>([]);
  const NzreleaseDate = convertToNZDate(releaseDate);
  const [similarFilmSearchQuery, setSimilarSearchQuery] =
    useState<SimilarFilmSearchQuery>({});
  const userId = parseInt((Cookies.get("UserId") as string) || "") || undefined;
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const navigate = useNavigate();

  //   const similarFilmSearchQuery: filmSearchQuery = {};
  //   similarFilmSearchQuery.genreIds = genreId;
  //   similarFilmSearchQuery.q = title;
  //   similarFilmSearchQuery.ageRatings = ageRating;
  useEffect(() => {
    async function fetchData() {
      try {
        const filmData = await fetchFilm(id);
        const genreData = await fetchFilmGenre();
        setGenre(genreData);
        setFilm(filmData);
        setAgeRating(filmData.ageRating);
        setDescription(filmData.description);
        setDirectorFirstName(filmData.directorFirstName);
        setDirectorId(filmData.directorId);
        setDirectorLastName(filmData.directorLastName);
        setFilmId(filmData.filmId);
        setGenreIds(filmData.genreId);
        setNumReviews(filmData.numReviews);
        setRating(filmData.rating);
        setReleaseDate(filmData.releaseDate);
        setRuntime(filmData.runtime);
        setTitle(filmData.title);
        const updatedSearchQuery: SimilarFilmSearchQuery = {
          genreIds: filmData.genreId,
          directorId: filmData.directorId,
        };
        setSimilarSearchQuery(updatedSearchQuery);
        const reviewData = await getReviews(filmData.filmId);

        console.log("Review data", reviewData);
        setReviews(reviewData);
      } catch (error) {
        console.error("Error fetching films:", error);
      }
    }

    fetchData();
  }, [id]);

  const getGenreName = (genreIds: number) => {
    const foundGenre = genre.find((g) => g.genreId === genreIds);

    return foundGenre ? foundGenre.name : "";
  };

  const handleDelete = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    setShowDeleteConfirmation(true);
  };

  const handleConfirmDelete = async () => {
    setShowDeleteConfirmation(false);
    const response = await deleteFilm(filmId);
    if (response.status === 200) {
      navigate("/myFilms");
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirmation(false);
  };
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [deleteButtonDisabled, setDeleteButtonDisabled] = useState(true);

  function passedReleaseDate(): boolean {
    const currentDateTime = moment().tz("Pacific/Auckland");

    if (moment(releaseDate).isBefore(currentDateTime)) {
      return true;
    } else {
      return false;
    }
  }
  function handleEditFilm(
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ): void {
    e.preventDefault();
    if (film) {
      navigate(`/editFilm/${film.filmId}`);
    }
  }
  return (
    <div className="filmPage">
      <Row>
        <Col lg={12}>
          <Card className="filmCard">
            <Card.Body>
              <Row>
                <Col xs={4}>
                  <FilmPictureComp filmId={filmId} />
                </Col>
                <Col xs={8}>
                  <h1>{title}</h1>
                  <h5>{description}</h5>
                  <Row>
                    <Col xs={10} lg={2} md={4}>
                      {rating !== null && (
                        <Rating
                          count={10}
                          value={rating}
                          size={12}
                          activeColor="#ffd700"
                          edit={false}
                        />
                      )}
                    </Col>
                    <Col xs={2} lg={1}>
                      <Card.Text className="mb-1">
                        <Badge bg="primary">{ageRating}</Badge>
                      </Card.Text>
                    </Col>

                    <Col xs={12} lg={2} md={6}>
                      {runtime} minutes
                    </Col>
                    <Col>{getGenreName(genreIds)}</Col>
                  </Row>
                  Released: {NzreleaseDate}
                  <Row className="directorBadge">
                    <Col lg={2} xs={8}>
                      Director:{" "}
                    </Col>
                    <Col xs={5} lg={1}>
                      <ProfilePictureComp id={directorId} />
                    </Col>
                    <Col xs={12} md={2} lg={2}>
                      <span>
                        {directorFirstName} {directorLastName}
                      </span>
                    </Col>
                  </Row>
                  <Row>
                    <Col lg={1}>
                      {userId !== directorId || !passedReleaseDate() ? (
                        <Button
                          variant="danger"
                          disabled={deleteButtonDisabled}
                          onClick={(e) => handleDelete(e)}
                        >
                          Delete
                        </Button>
                      ) : (
                        <Button
                          variant="danger"
                          onClick={(e) => handleDelete(e)}
                        >
                          Delete
                        </Button>
                      )}
                    </Col>
                    <Modal
                      show={showDeleteConfirmation}
                      onHide={handleCancelDelete}
                    >
                      <Modal.Header closeButton>
                        <Modal.Title>Confirm Deletion</Modal.Title>
                      </Modal.Header>
                      <Modal.Body>
                        Are you sure you want to delete this film? This action
                        cannot be undone.
                      </Modal.Body>
                      <Modal.Footer>
                        <Button
                          variant="secondary"
                          onClick={handleCancelDelete}
                        >
                          Cancel
                        </Button>
                        <Button variant="danger" onClick={handleConfirmDelete}>
                          Delete
                        </Button>
                      </Modal.Footer>
                    </Modal>
                    <Col>
                      {userId !== directorId ||
                      passedReleaseDate() ||
                      numReviews > 0 ? (
                        <Button
                          variant="primary"
                          disabled={isButtonDisabled}
                          onClick={(e) => handleEditFilm(e)}
                        >
                          Edit
                        </Button>
                      ) : (
                        <Button
                          variant="primary"
                          onClick={(e) => handleEditFilm(e)}
                        >
                          Edit
                        </Button>
                      )}
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <ReviewList reviews={reviews} />

      <Row className="similarFilms">
        <SimilarFilmComponent
          searchQuery={similarFilmSearchQuery}
          filmId={filmId}
        />
      </Row>
    </div>
  );
}
