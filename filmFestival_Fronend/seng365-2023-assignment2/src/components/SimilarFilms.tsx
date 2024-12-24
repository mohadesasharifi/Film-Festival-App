/** @format */

import React, { useEffect, useState } from "react";
import { fetchFilms, fetchSimilarFilms } from "../utils/filmsRequest";
import FilmCard from "./FilmCard";
import { Films, SimilarFilmSearchQuery, filmSearchQuery } from "../types/films";
import { Link } from "react-router-dom";

// Existing code...

export function SimilarFilmComponent({
  searchQuery,
  filmId,
}: {
  searchQuery: SimilarFilmSearchQuery;
  filmId: number;
}) {
  // Existing code...

  const [films, setFilms] = useState<Array<Films>>([]);
  const [filmCount, setFilmCount] = useState(0);

  useEffect(() => {
    async function fetchSimilarFilmsData() {
      try {
        // Call the backend API to fetch films based on the search query

        const filmData = await fetchSimilarFilms(searchQuery);
        console.log("From similar film component: ", filmData);
        const updatedFilms = filmData.films.filter(
          (film: Films) => film.filmId !== filmId
        );
        console.log(updatedFilms);
        setFilms(updatedFilms);
        setFilmCount(filmData.count);
      } catch (error) {
        console.error("Error fetching films:", error);
      }
    }

    fetchSimilarFilmsData();
  }, [searchQuery.directorId, searchQuery.genreIds]);

  return (
    <div className="similar-film-card">
      {films.length > 0 ? (
        <h3>You may also like</h3>
      ) : (
        <h3>No similar films</h3>
      )}
      <div className="card-container">
        {films.map((film: Films) => (
          <Link to={`/films/` + film.filmId} className="card-link">
            <FilmCard key={film.filmId} film={film} setting="SimilarFilms" />
          </Link>
        ))}
      </div>
    </div>
  );
}
