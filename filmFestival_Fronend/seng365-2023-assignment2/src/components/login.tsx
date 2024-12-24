/** @format */

import { useState, useEffect } from "react";
import { Button, Form, Row, Col, Nav } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { postLogin } from "../utils/usersRequest";

function Login(props: any) {
  const [email, setEmail] = useState("mohad@gmail.com");
  const [password, setPassword] = useState("123");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const handleSubmit = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();
    const response = await postLogin(email, password);
    if (response.status !== 200) {
      setError("Email address or password is incorrect");
    } else {
      setError("");
      navigate("/films");
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
            <Nav className="md">Login</Nav>
            <Nav>
              <NavLink to={"/users/register"}>Not a user? Register</NavLink>
            </Nav>
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              // id="inputPassword"
              aria-describedby="passwordHelpBlock"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>

          <Button
            variant="primary"
            type="submit"
            onClick={(e) => handleSubmit(e)}
          >
            Login
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
export default Login;
