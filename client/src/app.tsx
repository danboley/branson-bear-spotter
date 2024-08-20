import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { APIProvider } from "@vis.gl/react-google-maps";
import MapContainer from "./mapContainer";

const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const App = () => {
  const [backendData, setBackendData] = useState([{}]);

  // useEffect(() => {
  //   fetch("http://localhost:5005/api")
  //     .then((res) => res.json())
  //     .then((data) => {
  //       setBackendData(data);
  //     });
  // }, []);

  return (
    <APIProvider
      apiKey={apiKey}
      onLoad={() => console.log("Maps API has loaded.")}
    >
      <h1>Branson Bear Spotter</h1>
      {/* {typeof backendData.users === "undefined" ? (
        <p>Loading...</p>
      ) : (
        backendData.users.map((user, i) => <p key={i}>{user}</p>)
      )} */}
      <MapContainer />
    </APIProvider>
  );
};

const root = createRoot(document.getElementById("app")!);
root.render(<App />);
