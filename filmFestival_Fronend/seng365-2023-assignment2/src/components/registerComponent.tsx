/** @format */

import axios from "axios";
import Cookies from "js-cookie";
import { useState, useEffect } from "react";
import { Button, Form, Row, Col, Nav } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { postLogin, uploadProfilePhoto } from "../utils/usersRequest";
import { ValidateEmail } from "../utils/validation";

export const isLoggedIn = (): boolean => {
  const userToken = Cookies.get("UserToken");
  if (userToken !== undefined && userToken !== null) {
    return true;
  } else {
    return false;
  }
};

const postRegister = async (
  firstName: string,
  lastName: string,
  email: string,
  password: string
) => {
  return await axios
    .post(`http://localhost:4941/api/v1/users/register`, {
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: password,
    })
    .then((response) => {
      if (response.status === 201) {
        Cookies.set("UserId", response.data.userId);
        Cookies.set("UserToken", response.data.token);
      }
      return response;
    })
    .catch((error) => {
      return error.response.status;
    });
};

function Register() {
  const [firstName, setFirstName] = useState("Mohad");
  const [lastName, setLastName] = useState("Sharifi");
  const [email, setEmail] = useState("mohad@gmail.com");
  const [password, setPassword] = useState("123");
  const [image, setImage] = useState<any>(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();
    const response = await postRegister(firstName, lastName, email, password);
    if (response.status === 201) {
      const response = await postLogin(email, password);
    } else {
      setError(response.statusText);
    }
    if (image !== null) {
      // const fileObject = fileInput.target.files[0];
      const imageResponse = await uploadProfilePhoto(image.target.files[0]);

      if (response.status !== 201) {
        setError(response.statusText);
      } else if (imageResponse.status !== 201) {
        setError(imageResponse.statusText);
      } else {
        navigate("/films");
      }
    } else {
      if (response.status === 201) {
        navigate("/films");
      }
    }
  };

  useEffect(() => {
    const dummy = async () => {};
    dummy();
  }, []);

  return (
    <Row xs={1} md={3}>
      <Col></Col>
      <Col>
        <Form className="border border-dark bg-light p-4 m-4">
          <Form.Group className="mb-3">
            <Nav className="md">Register</Nav>
          </Form.Group>
          <Row>
            <Form.Group controlId="formFile" className="mb-3">
              <Form.Label>Upload Photo</Form.Label>
              <Form.Control type="file" onChange={(e) => setImage(e)} />
            </Form.Group>
          </Row>
          <Form.Group className="mb-3" controlId="formBasicFirstName">
            <Form.Label>First Name</Form.Label>
            <Form.Control
              type="first name"
              placeholder="Enter first name"
              isValid={firstName.length > 0}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicLastName">
            <Form.Label>Last Name</Form.Label>
            <Form.Control
              type="last name"
              placeholder="Enter last name"
              isValid={lastName.length > 0}
              onChange={(e) => setLastName(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              isValid={ValidateEmail(email)}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              aria-describedby="passwordHelpBlock"
              placeholder="Password"
              isValid={password.length > 5}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>

          <Button
            variant="primary"
            type="submit"
            onClick={(e) => handleSubmit(e)}
          >
            Register
          </Button>

          <Form.Group className="mb-3" controlId="formBasicLabel">
            <Form.Label className="text-danger">{error}</Form.Label>
          </Form.Group>
        </Form>
      </Col>
      <Col></Col>
    </Row>
  );
}
export default Register;
