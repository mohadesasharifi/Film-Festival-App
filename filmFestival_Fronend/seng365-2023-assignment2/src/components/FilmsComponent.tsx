/** @format */

import React, { useEffect, useState } from "react";
import { fetchFilmGenre, fetchFilms } from "../utils/filmsRequest";
import FilmCard from "./FilmCard";
import { Films, filmSearchQuery, genre } from "../types/films";
import { Link } from "react-router-dom";
import { Button, Col, Dropdown, Form, InputGroup, Row } from "react-bootstrap";

const ageRatings = ["G", "PG", "R18", "R16", "M", "R13"];

export function FilmsComponent() {
  const [films, setFilms] = useState<Array<Films>>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filmsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [q, setQ] = useState("");
  const [searchQuery, setSearchQuery] = useState<filmSearchQuery>({});
  const [selectedGenres, setSelectedGenres] = useState<number[]>([]);
  const [genres, setGenres] = useState<genre[]>([]);
  const [sortBy, setSortBy] = useState("RELEASED_ASC");
  const [selectedAgeRatings, setSelectedAgeRatings] = useState<string[]>([]);
  const [AgeRdropdownOpen, setAgeRDropdownOpen] = useState(false);
  const [genredropdownOpen, setGenreDropdownOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, [q, currentPage, searchQuery.sortBy, ageRatings, searchQuery.genreIds]);

  const fetchData = async () => {
    try {
      const updatedSearchQuery: filmSearchQuery = {
        q,
        genreIds: selectedGenres,
        ageRatings: selectedAgeRatings,
        sortBy: sortBy,
        count: filmsPerPage,
        startIndex: (currentPage - 1) * filmsPerPage,
      };
      if (q === "") {
        delete updatedSearchQuery.q;
      }

      const genreData = await fetchFilmGenre();
      setGenres(genreData);
      setSearchQuery(updatedSearchQuery);
      const filmsData = await fetchFilms(updatedSearchQuery);

      setFilms(filmsData.films);
      const total = Math.ceil(filmsData.count / filmsPerPage);
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

  const goToPage = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setQ(value);
  };

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSortBy(value);
  };

  const handleGenreChange = (genreId: number) => {
    const selectedGenre = genres.find((genre) => genre.genreId === genreId);

    if (selectedGenre) {
      const isGenreSelected = selectedGenres.some((genre) => genre === genreId);

      if (isGenreSelected) {
        setSelectedGenres((prevSelectedGenres) =>
          prevSelectedGenres.filter((genre) => genre !== genreId)
        );
      } else {
        setSelectedGenres((prevSelectedGenres) => [
          ...prevSelectedGenres,
          genreId, // Add genreId instead of the selectedGenre object
        ]);
      }
    }
  };

  const handleGenreToggle = () => {
    setGenreDropdownOpen(!genredropdownOpen);
  };
  const handleAgeRatingToggle = () => {
    setAgeRDropdownOpen(!AgeRdropdownOpen);
  };

  const handleAgeRatingChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { value, checked } = event.target;
    if (checked) {
      setSelectedAgeRatings((prevSelectedAgeRatings) => [
        ...prevSelectedAgeRatings,
        value,
      ]);
    } else {
      setSelectedAgeRatings((prevSelectedAgeRatings) =>
        prevSelectedAgeRatings.filter((rating) => rating !== value)
      );
    }
  };

  const handleFilter = () => {
    fetchData();
  };

  return (
    <div>
      <div className="filterContainer">
        <Row>
          <Col lg={3} md={3} xs={6}>
            <Form.Group controlId="search">
              <Form.Control
                type="text"
                placeholder="Search films"
                value={q}
                onChange={handleSearch}
                style={{
                  backgroundColor: "rgb(245, 245, 245)",
                  borderColor: "white",
                }}
              />
            </Form.Group>
          </Col>
          <Col lg={2} md={2} xs={6}>
            <Form.Group
              controlId="sort"
              // style={{
              //   backgroundColor: "rgb(245, 245, 245)",
              //   borderColor: "white",
              // }}
            >
              <Form.Select
                value={sortBy}
                onChange={handleSortChange}
                style={{
                  backgroundColor: "rgb(245, 245, 245)",
                  borderColor: "white",
                }}
              >
                <option value="RELEASED_ASC">
                  Release Date (Oldest to Newest)
                </option>
                <option value="RELEASED_DESC">
                  Release Date (Newest to Oldest)
                </option>
                <option value="ALPHABETICAL_ASC">Alphabetical (A to Z)</option>
                <option value="ALPHABETICAL_DESC">Alphabetical (Z to A)</option>
                <option value="RATING_ASC">Rating (Lowest to Highest)</option>
                <option value="RATING_DESC">Rating (Highest to Lowest)</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col lg={1} md={2} xs={4}>
            <Form.Group controlId="genre">
              <Dropdown show={genredropdownOpen} onToggle={handleGenreToggle}>
                <Dropdown.Toggle variant="light" id="ageRatingsDropdown">
                  {" Genres   "}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {genres.map((genre) => (
                    <Dropdown.Item key={genre.genreId}>
                      <Form.Check
                        key={genre.genreId}
                        type="checkbox"
                        label={genre.name}
                        value={genre.genreId}
                        checked={selectedGenres.some(
                          (selectedGenre) => selectedGenre === genre.genreId
                        )}
                        onChange={() => handleGenreChange(genre.genreId)}
                      />
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
            </Form.Group>
          </Col>
          <Col lg={1} md={3} xs={5}>
            <div>
              <Form.Group controlId="ageRatings">
                <Dropdown
                  show={AgeRdropdownOpen}
                  onToggle={handleAgeRatingToggle}
                >
                  <Dropdown.Toggle variant="light" id="ageRatingsDropdown">
                    {selectedAgeRatings.length === 0
                      ? "Age Rating"
                      : selectedAgeRatings.join(", ")}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    {ageRatings.map((ageRating) => (
                      <Dropdown.Item key={ageRating}>
                        <Form.Check
                          type="checkbox"
                          id={`ageRating-checkbox-${ageRating}`}
                          label={ageRating}
                          value={ageRating}
                          checked={selectedAgeRatings.includes(ageRating)}
                          onChange={handleAgeRatingChange}
                        />
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>
              </Form.Group>
            </div>
          </Col>
          <Col lg={1} md={1} xs={2}>
            <Button variant="primary" onClick={handleFilter}>
              Filter
            </Button>
          </Col>
        </Row>
      </div>
      <div className="card-container">
        {films.map((film: Films) => (
          <Link
            to={`/films/${film.filmId}`}
            className="card-link"
            key={film.filmId}
          >
            <FilmCard film={film} setting="FilmsComponent" />
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
    </div>
  );
}

export default FilmsComponent;
