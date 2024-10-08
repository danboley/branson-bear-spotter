import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { APIProvider } from "@vis.gl/react-google-maps";
import { AuthProvider } from "./AuthContext";
import MapContainer from "./mapContainer";
import PoiForm from "./PoiSubmissionForm";
import Home from "./Home";
import Register from "./Register";
import Login from "./Login";
import NavBar from "./NavBar";
import AdminPortal from "./AdminPortal";
import AdminPoiForm from "./AdminPoiForm";
import PoiDetails from "./PoiDetails";
import UserProfile from "./UserProfile";
import Footer from "./Footer";
import { Poi } from "./types/types";
import axios from "axios";
import "./index.css";
import NotFound from "./NotFound";
import About from "./About";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ManageSubmissions from "./ManageSubmissions";
import EditSubmissionForm from "./EditSubmissionForm";
import AdminRegistration from "./AdminRegistration";
import EditProfile from "./EditProfile";

const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const App: React.FC = () => {
  const [pois, setPois] = useState<Poi[]>([]);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleWindowResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleWindowResize);

    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, []);

  // Get all Pois
  useEffect(() => {
    const getPois = async () => {
      try {
        const response = await axios.get("https://branson-bear-spotter.onrender.com/api/pois");
        setPois(response.data);
      } catch (error: any) {
        toast.error(error.message);
      }
    };
    getPois();
  }, []);

  // Add Poi Callback
  function addPoi(newPoi: Poi) {
    setPois((prevPois) => [...prevPois, newPoi]);
  }

  // Edit Poi Callback
  function editPoi(editedPoi: Poi) {
    const updatedPois = pois?.map((poi) =>
      poi?.id === editedPoi?.id ? editedPoi : poi
    );
    setPois(updatedPois);
  }

  // Delete Poi Callback
  function deletePoi(id: any) {
    const refinedPois = pois?.filter((poi: any) => poi.id !== id);
    setPois(refinedPois);
  }

  return (
    <APIProvider apiKey={apiKey}>
      <AuthProvider>
        <Router>
          <NavBar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/register" element={<Register />} />
            <Route path="/admin-registration" element={<AdminRegistration />} />
            <Route path="/login" element={<Login />} />
            <Route path="/map" element={<MapContainer pois={pois} />} />
            <Route path="/submissions" element={<PoiForm addPoi={addPoi} />} />
            <Route path="/admin-portal" element={<AdminPortal pois={pois} />} />
            <Route
              path="/pois/edit/:id"
              element={<AdminPoiForm editPoi={editPoi} deletePoi={deletePoi} />}
            />
            <Route path="/pois/:id" element={<PoiDetails />} />
            <Route path="/profile/:id" element={<UserProfile pois={pois} />} />
            <Route path="/edit-profile/:id" element={<EditProfile />} />

            <Route
              path="/manage-submissions/:id"
              element={<ManageSubmissions />}
            />
            <Route
              path="/edit-submission/:id"
              element={<EditSubmissionForm editPoi={editPoi} />}
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <ToastContainer />
          <Footer windowWidth={windowWidth} />
        </Router>
      </AuthProvider>
    </APIProvider>
  );
};

const root = createRoot(document.getElementById("app")!);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
