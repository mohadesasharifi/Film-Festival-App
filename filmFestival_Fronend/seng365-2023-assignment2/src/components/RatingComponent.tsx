/** @format */

import React from "react";
import { Row, Col } from "react-bootstrap";
import Rating from "react-rating-stars-component";

interface FilmRatingProps {
  rating: any;
}

const FilmRating: React.FC<FilmRatingProps> = ({ rating }) => {
  return (
    <Row>
      <Col xs={6}>
        <Rating
          count={10}
          value={rating}
          size={12}
          activeColor="#ffd700"
          edit={false}
        />
      </Col>
    </Row>
  );
};

export default FilmRating;
