/** @format */

import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import { Container, Nav, Navbar } from "react-bootstrap";
import { isLoggedIn } from "../utils/usersRequest";
import { Postlogout } from "./logout";

const getLocation = () => {
  return window.location.href === "http://localhost:3000/users/login";
};

function AppNavbar() {
  const navigate = useNavigate();
  const [showProfile, setProfile] = useState<boolean>();

  const handleLogin = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();
    navigate("/login");
  };

  const handleLogout = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();
    Postlogout();
    navigate("/login");
  };

  useEffect(() => {
    const dummy = async () => {
      setProfile(isLoggedIn());
    };
    dummy();
  }, [isLoggedIn(), setProfile]);

  return (
    <Navbar>
      <Nav className="mr-auto">
        <Nav.Item>
          <Nav.Link as={Link} to="/films">
            films
          </Nav.Link>
        </Nav.Item>
      </Nav>

      <Nav>
        <Nav.Item>
          <Nav.Link href="/MyFilms">{isLoggedIn() ? "My Films" : ""}</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          {isLoggedIn() ? (
            <Nav.Link href="/profile">My Profile</Nav.Link>
          ) : (
            <span></span>
          )}
        </Nav.Item>
        <Nav.Item>
          {isLoggedIn() ? (
            <Button
              variant="success"
              type="submit"
              disabled={getLocation()}
              onClick={(e) => handleLogout(e)}
            >
              Logout
            </Button>
          ) : (
            <Button
              variant="success"
              type="submit"
              disabled={getLocation()}
              onClick={(e) => handleLogin(e)}
            >
              Login/Register
            </Button>
          )}
        </Nav.Item>
      </Nav>
    </Navbar>
  );
}

export default AppNavbar;
