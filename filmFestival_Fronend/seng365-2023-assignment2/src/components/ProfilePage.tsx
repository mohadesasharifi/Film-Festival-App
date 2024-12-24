/** @format */

import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { Row, Col, Form, Button, Figure } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { getProfileData, getProfileImage } from "../utils/usersRequest";

function Users() {
  const id = Cookies.get("UserId");
  let userId: number;
  if (id !== undefined) {
    userId = parseInt(id);
  }
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [profile, setProfile] = useState("");
  const navigate = useNavigate();
  const handleSubmit = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();
    // const response = await patchUser(firstName, lastName, email, password);
    navigate(`/EditUser/${userId}`);
  };

  useEffect(() => {
    const dummy = async () => {
      const userData = getProfileData();
      setFirstName((await userData).firstName);
      setLastName((await userData).lastName);
      setEmail((await userData).email);
      const photo = getProfileImage(userId);
      setProfile(await photo);
    };
    dummy();
  }, []);

  return (
    <Row>
      <Col></Col>
      <Col>
        <Form className="border border-dark bg-light p-4 m-4">
          <Row>
            <Figure>
              <Figure.Image
                width={80}
                height={80}
                // alt="../storage/no_image.png"
                roundedCircle
                src={profile}
              />
            </Figure>
          </Row>
          <Row>
            <Col>
              <Form.Label className="lg">
                <h3>
                  {firstName} {lastName}
                </h3>
              </Form.Label>
            </Col>
          </Row>
          <Row>
            {" "}
            <Col></Col>
            <h6>{email}</h6>
            <Col></Col>
          </Row>
          <Row className="m-2">
            <Col></Col>
            <Col>
              <Button
                variant="primary"
                type="submit"
                onClick={(e) => handleSubmit(e)}
              >
                Edit
              </Button>
            </Col>

            <Col></Col>
          </Row>
        </Form>
      </Col>
      <Col></Col>
    </Row>
  );
}
export default Users;
