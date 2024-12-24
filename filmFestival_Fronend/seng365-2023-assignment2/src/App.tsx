/** @format */

import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { FilmsComponent } from "./components/FilmsComponent";
import { FilmComponent } from "./components/FilmComponent";
import "./App.css";
import Navbar from "./components/Navbar";
import "bootstrap/dist/css/bootstrap.min.css";
import Register from "./components/registerComponent";
import Login from "./components/login";
import Myfilms from "./components/myFilms";
import AddFilm from "./components/AddFilm";
import ProfilePage from "./components/ProfilePage";
import EditProfile from "./components/EditProfile";
import EditFilm from "./components/editFilm";
function App() {
  const [profileState, setProfileState] = useState(false);
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/films" element={<FilmsComponent />} />
        <Route path="/films/:id" element={<FilmComponent />} />
        <Route path="/users/register" element={<Register />} />
        <Route path="/MyFilms" element={<Myfilms />} />
        <Route path="/addFilms" element={<AddFilm />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/EditUser/:id" element={<EditProfile />} />
        <Route path="/editFilm/:id" element={<EditFilm />} />

        <Route
          path="/login"
          element={<Login profileState={setProfileState} />}
        />
        {/* Add more routes here if needed */}
      </Routes>
    </Router>
  );
}

export default App;
