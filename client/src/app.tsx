import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { APIProvider } from "@vis.gl/react-google-maps";
import { AuthProvider } from "./AuthContext";
import MapContainer from "./mapContainer";
import PoiForm from "./poiForm";
import Home from "./home";
import Register from "./Register";
import Login from "./Login";

const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const App = () => {
  const [backendData, setBackendData] = useState([{}]);
  console.log(backendData);
  useEffect(() => {
    fetch("http://localhost:5005/api/users")
      .then((res) => res.json())
      .then((data) => {
        setBackendData(data);
      });
  }, []);
  return (
    <APIProvider
      apiKey={apiKey}
      onLoad={() => console.log("Maps API has loaded.")}
    >
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Home backendData={backendData} />} />
            <Route path="/home" element={<Home backendData={backendData} />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/map" element={<MapContainer />} />
            <Route path="/submissions" element={<PoiForm />} />
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
