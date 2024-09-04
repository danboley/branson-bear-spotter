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
import { Poi } from "./types/types";
import axios from "axios";

const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const App: React.FC = () => {
  const [pois, setPois] = useState<Poi[]>([]);
  const [errors, setErrors] = useState<string[] | null>(null);

  console.log(pois);

  // Get all Pois
  useEffect(() => {
    const getPois = async () => {
      try {
        const response = await axios.get("http://localhost:5005/api/pois");
        setPois(response.data);
      } catch (error) {
        if (axios.isAxiosError(error) && error.message) {
          setErrors([error.message]);
        } else {
          setErrors(["An unexpected error occurred."]);
        }
        console.error("Error fetching POIs:", error);
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
    <APIProvider
      apiKey={apiKey}
      onLoad={() => console.log("Maps API has loaded.")}
    >
      <AuthProvider>
        <Router>
          <NavBar />
          <Routes>
            <Route path="/" element={<Home pois={pois} />} />
            <Route path="/home" element={<Home pois={pois} />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/map" element={<MapContainer pois={pois} />} />
            <Route path="/submissions" element={<PoiForm addPoi={addPoi} />} />
            <Route path="/admin-portal" element={<AdminPortal pois={pois} />} />
            <Route
              path="/pois/edit/:id"
              element={<AdminPoiForm editPoi={editPoi} deletePoi={deletePoi} />}
            />
            <Route path="/pois/:id" element={<PoiDetails />} />
          </Routes>
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
