import React from "react";
import { createRoot } from "react-dom/client";
import { APIProvider } from "@vis.gl/react-google-maps";
import MapContainer from "./mapContainer";

const App = () => (
  <APIProvider
    apiKey={"AIzaSyBWtyVXZISL3G4ob9wIAgdoHk0l5M2t9Go"}
    onLoad={() => console.log("Maps API has loaded.")}
  >
    <h1>Branson Bear Spotter</h1>
    <MapContainer />
  </APIProvider>
);

const root = createRoot(document.getElementById("app"));
root.render(<App />);
