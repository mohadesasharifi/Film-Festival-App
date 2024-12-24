/** @format */

import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { Button, Card, Col, Row } from "react-bootstrap";
import { fetchFilms, getReviews } from "../utils/filmsRequest";
import { Films } from "../types/films";
import { isLoggedIn } from "../utils/usersRequest";
import filmImage from "./filmImage";
import ProfileImageComp from "./ProfileImageComp";
import { filmSearchQuery } from "../types/films";
import FilmCard from "./FilmCard";
import { Badge } from "react-bootstrap";

function MyFilms() {
  const userId = parseInt((Cookies.get("UserId") as string) || "") || undefined;
  const [films, setFilms] = useState<Array<Films>>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filmsPerPage] = useState(10); // Change this value to adjust the number of films per page
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState<filmSearchQuery>({});
  const [reviews, setReviews] = useState<boolean>(false);

  const navigate = useNavigate();
  if (!isLoggedIn()) {
    navigate("/login");
  }

  useEffect(() => {
    fetchData();
  }, [currentPage, searchQuery.directorId, searchQuery.reviewerId]);
  const fetchData = async () => {
    try {
      const SearchQuery1: filmSearchQuery = {
        ...searchQuery,
        directorId: userId,
        count: filmsPerPage,
        startIndex: (currentPage - 1) * filmsPerPage,
      };
      const SearchQuery2: filmSearchQuery = {
        ...searchQuery,
        reviewerId: userId,
        count: filmsPerPage,
        startIndex: (currentPage - 1) * filmsPerPage,
      };
      // setSearchQuery(updatedSearchQuery);
      const myDirectedFilms = await fetchFilms(SearchQuery1);
      const myReviewedFilms = await fetchFilms(SearchQuery2);

      setFilms(myDirectedFilms.films.concat(myReviewedFilms.films));
      const count = myDirectedFilms.count + myReviewedFilms.count;
      const total = Math.ceil(count / filmsPerPage);
      setTotalPages(total);
    } catch (error) {
      console.error("Error fetching films:", error);
    }
  };

  const nextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const prevPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  const goToPage = (pageNumber: React.SetStateAction<number>) => {
    setCurrentPage(pageNumber);
  };

  function handleSubmit(
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ): void {
    navigate("/addFilms");
  }

  return (
    <>
      <Row>
        <Button
          variant="primary"
          type="submit"
          onClick={(e) => handleSubmit(e)}
        >
          Add Film
        </Button>
      </Row>
      <h4
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Badge bg="info">
          {" "}
          A film can be deleted once a review has been placed or the release
          date has been passed
        </Badge>
      </h4>
      <h4
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Badge bg="info">
          {" "}
          Once the release date of a film has passed, the release date can not
          be edited.
        </Badge>{" "}
      </h4>
      <h4
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Badge bg="info">
          Once a review has been placed on a film, the film can no longer be
          edited.
        </Badge>
      </h4>
      .
      <div className="card-container">
        {films.map((film: Films) => (
          <Link
            to={`/films/${film.filmId}`}
            className="card-link"
            key={film.filmId}
          >
            <FilmCard film={film} setting={"myFilm"} />
          </Link>
        ))}

        {/* Pagination */}
        <div className="pagination d-flex justify-content-center align-items-center mt-3">
          {currentPage > 1 && (
            <Button variant="primary" onClick={prevPage}>
              Previous
            </Button>
          )}

          {Array.from({ length: totalPages }, (_, index) => (
            <Button
              key={index + 1}
              onClick={() => goToPage(index + 1)}
              variant={currentPage === index + 1 ? "primary" : "light"}
            >
              {index + 1}
            </Button>
          ))}

          {currentPage < totalPages && (
            <Button variant="primary" onClick={nextPage}>
              Next
            </Button>
          )}
        </div>
      </div>
    </>
  );
}

export default MyFilms;
