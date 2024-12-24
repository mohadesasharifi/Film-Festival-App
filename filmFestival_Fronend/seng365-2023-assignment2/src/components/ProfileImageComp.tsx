/** @format */

import { useState, useEffect } from "react";
import { Figure } from "react-bootstrap";
import { fetchUserImage } from "../utils/usersRequest";
function ProfilePictureComp(userId: any) {
  const [profilePicure, setProfilePicture] = useState("");
  useEffect(() => {
    const dummy = async () => {
      const photo = await fetchUserImage(userId.id);
      setProfilePicture(photo);
    };
    dummy();
  }, [userId.id]);

  return (
    <div className="profile-image">
      <Figure>
        <Figure.Image
          className="circle_image"
          width={60}
          height={60}
          alt="../storage/noProfile.png"
          roundedCircle
          src={profilePicure}
        />
      </Figure>
    </div>
  );
}
export default ProfilePictureComp;
