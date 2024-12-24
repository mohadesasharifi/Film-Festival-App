/** @format */

import React from "react";
import { Col, ListGroup, Row } from "react-bootstrap";
import { reviewResponse } from "../types/films";
import ProfileImageComp from "./ProfileImageComp";
import ProfileNameComp from "./profileNameComp";
import RatingComponent from "./RatingComponent";
import { Container } from "react-bootstrap";
type ReviewListProps = {
  reviews: Array<reviewResponse>;
};
function ReviewList({ reviews }: ReviewListProps) {
  return (
    <ListGroup>
      {reviews.length > 0 ? <h3>Reviews</h3> : <h3>No reviews</h3>}
      {reviews.map((review, index) => (
        <ListGroup.Item key={index} variant="success">
          <Row>
            <Col md={3} lg={2} sm={4} xs={5}>
              <h5>
                <ProfileNameComp
                  id={review.reviewerId}
                  firstName={review.reviewerFirstName}
                  lastName={review.reviewerLastName}
                />
              </h5>
            </Col>
            <Col>
              <RatingComponent rating={review.rating} />
            </Col>
          </Row>
          <Row>
            <Col>
              <p>{review.review || "No review available"}</p>
            </Col>
          </Row>
          <p>{review.timestamp}</p>
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
}

export default ReviewList;
