/** @format */

import React from "react";
import { Card, Form, Button } from "react-bootstrap";

const FilterBox = () => {
  return (
    <Card>
      <Card.Body>
        <Card.Title>Filter Movies</Card.Title>
        <Form>
          {/* Your filtering form components here */}
          <Form.Group controlId="genre">
            <Form.Label>Genre</Form.Label>
            <Form.Control as="select">
              <option value="">All</option>
              <option value="action">Action</option>
              <option value="comedy">Comedy</option>
              {/* Add more options */}
            </Form.Control>
          </Form.Group>

          {/* Add more filtering form components */}

          <Button variant="primary" type="submit">
            Apply Filters
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default FilterBox;
