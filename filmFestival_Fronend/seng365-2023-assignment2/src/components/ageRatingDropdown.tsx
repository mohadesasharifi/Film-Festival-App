/** @format */

import React, { useState, useRef } from "react";
import { Button, Dropdown, Form } from "react-bootstrap";

const ageRatings = ["G", "PG", "R18", "R16", "M", "R13"];

export function AgeRatingsDropdown() {
  const [selectedAgeRatings, setSelectedAgeRatings] = useState<string[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleAgeRatingToggle = () => {
    setDropdownOpen(!dropdownOpen);
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

  return (
    <div>
      <Form.Group controlId="ageRatings">
        <Dropdown show={dropdownOpen} onToggle={handleAgeRatingToggle}>
          <Dropdown.Toggle variant="secondary" id="ageRatingsDropdown">
            {selectedAgeRatings.length === 0
              ? "Select Age Ratings"
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
  );
}
