/** @format */

import { useState, useEffect } from "react";
import { Button, Form, Row, Col, Nav, FloatingLabel } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import {
  PatchUser,
  uploadProfilePhoto,
  deleteProfilePhoto,
} from "../utils/usersRequest";
import { ValidateEmail } from "../utils/validation";
import ProfileImageComp from "./ProfileImageComp";
function EditUser() {
  const [firstName, setFirstName] = useState("Mohad");
  const [lastName, setLastName] = useState("Sharifi");
  const [email, setEmail] = useState("mohad@gmail.com");
  const [currentPassword, setCurrentPassword] = useState("123");
  const [password, setPassword] = useState("123");
  const [error, setError] = useState("");
  const [imageError, setImageError] = useState("");
  const [image, setImage] = useState<any>(null);
  const navigate = useNavigate();
  const { id } = useParams();
  function validateAll() {
    let validate = true;
    let emailValid;
    if (email !== "") emailValid = ValidateEmail(email);
    if (password !== "") validate = password.length >= 6;

    return !((validate && emailValid) || (firstName || lastName) !== "");
  }
  const handleDeletePhoto = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    const response = await deleteProfilePhoto();
    if (response.status !== 200) {
      setError(response.statusText);
    }
  };
  const handleSubmit = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();
    const response = await PatchUser(
      firstName,
      lastName,
      email,
      password,
      currentPassword
    );
    if (response.status !== 200) {
      setError(response.statusText);
    }
    if (image !== null) {
      const imageResponse = await uploadProfilePhoto(image.target.files[0]);

      if (response.status === 200) {
        navigate("/profile");
      }
      if (imageResponse.status !== 200 || imageResponse.status !== 201) {
        setImageError(imageResponse.statusText);
      }
    }
    if (response.status === 200) {
      navigate("/profile");
    }
  };

  const handleCancel = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();
    navigate("/profile");
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
            <Nav className="md">
              <strong>Edit Details</strong>
            </Nav>
          </Form.Group>
          <Row>
            <Col></Col>
            <Col>
              <div>
                <ProfileImageComp userId={id} />
              </div>
            </Col>
          </Row>
          <Row>
            <Col xs={7}>
              <Form.Group controlId="formFile" className="mb-3">
                <Form.Label>Upload Photo</Form.Label>
                <Form.Control type="file" onChange={(e) => setImage(e)} />
              </Form.Group>
            </Col>
            <Col
              className="p-2
                        
                        "
            >
              <Button variant="danger" onClick={(e) => handleDeletePhoto(e)}>
                Delete
              </Button>
            </Col>
          </Row>

          <Row>
            <Col>
              {" "}
              <Form.Group className="mb-3" controlId="formBasicFirstName">
                <FloatingLabel
                  className="mb-3"
                  label="First name"
                  controlId="floatingInput"
                >
                  <Form.Control
                    type="first name"
                    placeholder="First name"
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </FloatingLabel>
              </Form.Group>
            </Col>
            <Col>
              {" "}
              <Form.Group className="mb-3" controlId="formBasicLastName">
                <FloatingLabel
                  className="mb-3"
                  label="Last name"
                  controlId="floatingInput"
                >
                  <Form.Control
                    type="last name"
                    placeholder="Last name"
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </FloatingLabel>
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3" controlId="formBasicEmail">
            <FloatingLabel
              className="mb-3"
              label="Email"
              controlId="floatingInput"
            >
              <Form.Control
                type="email"
                isValid={ValidateEmail(email) || email === ""}
                onChange={(e) => setEmail(e.target.value)}
              />
            </FloatingLabel>
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicPassword">
            <FloatingLabel
              className="mb-3"
              label="New password"
              controlId="floatingInput"
            >
              <Form.Control
                type="password"
                // id="inputPassword"
                aria-describedby="passwordHelpBlock"
                placeholder="New Password"
                isValid={password.length > 5}
                onChange={(e) => setPassword(e.target.value)}
              />
            </FloatingLabel>
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicPassword">
            <FloatingLabel
              className="mb-3"
              label="Current password"
              controlId="floatingInput"
            >
              <Form.Control
                type="password"
                // id="inputPassword"
                aria-describedby="passwordHelpBlock"
                placeholder="Current Password"
                isValid={currentPassword.length > 5}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </FloatingLabel>
          </Form.Group>
          <Row>
            <Col>
              <Button
                variant="primary"
                type="submit"
                disabled={validateAll()}
                onClick={(e) => handleSubmit(e)}
              >
                Save Changes
              </Button>
            </Col>
            <Col>
              <Button
                variant="primary"
                type="submit"
                onClick={(e) => handleCancel(e)}
              >
                Cancel
              </Button>
            </Col>
          </Row>

          <Form.Group className="mb-3" controlId="formBasicLabel">
            <Form.Label className="text-danger">{error}</Form.Label>
          </Form.Group>
        </Form>
      </Col>
      <Col></Col>
    </Row>
  );
}
export default EditUser;
