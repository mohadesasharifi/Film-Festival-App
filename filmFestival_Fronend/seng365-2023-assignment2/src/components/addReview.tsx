/** @format */

import React, { useState } from "react";
import { Form, FormControl, Button, Card } from "react-bootstrap";
import { writeReview } from "../utils/filmsRequest";
import { isLoggedIn } from "../utils/usersRequest";
import { useNavigate, useParams } from "react-router-dom";
interface ReviewFormProps {
  filmId: number;
}
function ReviewForm({ filmId }: ReviewFormProps) {
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(0);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    console.log("from addReview: ", filmId, id, review, rating);
    try {
      // Call the writeReview function to post the review
      if (isLoggedIn()) {
        const response = await writeReview(
          filmId,
          Number(id || ""),
          review,
          rating
        );
      } else {
        navigate("/login");
      }

      // Handle the response based on your requirements
      console.log("Review posted successfully");
    } catch (error) {
      // Handle errors if the review posting fails
      console.error("Error posting review:", error);
    }
  };

  return (
    <Card>
      <Card.Body>
        <Card.Title>Write a Review</Card.Title>
        <Form>
          <Form.Group controlId="reviewTextarea">
            <Form.Label>Review</Form.Label>
            <FormControl
              as="textarea"
              rows={3}
              value={review}
              onChange={(e) => setReview(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="ratingSelect">
            <Form.Label>Rating</Form.Label>
            <FormControl
              as="select"
              value={rating}
              onChange={(e) => setRating(parseInt(e.target.value, 10))}
            >
              <option value={1}>1</option>
              <option value={2}>2</option>
              <option value={3}>3</option>
              <option value={4}>4</option>
              <option value={5}>5</option>
            </FormControl>
          </Form.Group>
          <Button variant="primary" type="submit" onSubmit={handleSubmit}>
            Submit
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
}

export default ReviewForm;
