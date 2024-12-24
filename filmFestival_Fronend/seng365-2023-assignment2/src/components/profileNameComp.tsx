/** @format */

import React from "react";
import { Row, Col } from "react-bootstrap";
import ProfilePictureComp from "./ProfileImageComp";
// import UserBadgeProps from "../types/films";
type UserBadgeProps = {
  id: number;
  firstName: string;
  lastName: string;
};
const UserBadge = ({ id, firstName, lastName }: UserBadgeProps) => {
  return (
    <Row className="director-badge">
      <Col xs={2}>
        <ProfilePictureComp id={id} />
      </Col>
      <Col xs={10}>
        <span>
          {firstName} {lastName}
        </span>
      </Col>
    </Row>
  );
};

export default UserBadge;
