import { createRoot } from "react-dom/client";
import { APIProvider } from "@vis.gl/react-google-maps";
import MapContainer from "./mapContainer";

const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const App = () => (
  <APIProvider
    apiKey={apiKey}
    onLoad={() => console.log("Maps API has loaded.")}
  >
    <h1>Branson Bear Spotter</h1>
    <MapContainer />
  </APIProvider>
);

const root = createRoot(document.getElementById("app")!);
root.render(<App />);
