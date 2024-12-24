/** @format */
import React, { useEffect, useState } from "react";
import { Films } from "../types/films";
import { Row, Col, Card, Badge, Button, Alert } from "react-bootstrap";
import { FilmsComponent } from "./FilmsComponent";
import { convertToNZDate } from "../utils/formatDate";
import FilmPictureComp from "../components/filmImage";
import Rating from "react-rating-stars-component";
import ProfilePictureComp from "../components/ProfileImageComp";
import UserBadge from "./profileNameComp";

import { fetchFilms, getReviews } from "../utils/filmsRequest";
import { convertCompilerOptionsFromJson } from "typescript";

function FilmCard({ film, setting }: { film: Films; setting: string }) {
  const releaseDate = convertToNZDate(film.releaseDate);

  return (
    <>
      <Card className="my-3">
        <Card.Body>
          <FilmPictureComp filmId={film.filmId} />
          <Row>
            <Col xs={12}>
              <h5 className="mb-0">{film.title}</h5>
            </Col>
          </Row>
          <Row>
            <Col xs={6}>
              <Rating
                count={10}
                value={film.rating}
                size={12}
                activeColor="#ffd700"
                edit={false}
              />
            </Col>
          </Row>
          <Row className="directorBadge">
            <Col xs={2}>
              <ProfilePictureComp id={film.directorId} />
            </Col>
            <Col xs={10}>
              <span>
                {film.directorFirstName} {film.directorLastName}
              </span>
            </Col>
          </Row>
          <Row>
            <Col xs={10}>Released: {releaseDate}</Col>

            <Col xs={2}>
              <Card.Text className="mb-1">
                <Badge bg="primary">{film.ageRating}</Badge>
              </Card.Text>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </>
  );
}

export default FilmCard;
