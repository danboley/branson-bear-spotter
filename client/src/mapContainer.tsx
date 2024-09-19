import { Map } from "@vis.gl/react-google-maps";
import PoiMarkers from "./poiMarkers";
import { Poi } from "./types/types";
import { useAuth } from "./AuthContext";
import { useState } from "react";

interface MapContainerProps {
  pois: Poi[];
}

const MapContainer: React.FC<MapContainerProps> = ({ pois }) => {
  const { userId: activeUserId } = useAuth();
  const [showMySubmissions, setShowMySubmissions] = useState(false);

  const filterPoisByActiveUser = () =>
    pois.filter((poi) => poi.userId === activeUserId);

  const toggleMySubmissions = () => {
    setShowMySubmissions((prev) => !prev);
  };

  const filteredPois = showMySubmissions ? filterPoisByActiveUser() : pois;

  return (
    <div className="bg-main p-4 flex flex-col min-h-screen items-center">
      <h1 className="py-4 text-4xl font-bold text-center text-text-light">
        Find Branson Bear Worldwide
      </h1>
      <div className="flex pb-4 space-x-4 items-center justify-center">
        <h2 className="text-xl font-semibold text-text-light">Filter:</h2>
        <button
          onClick={toggleMySubmissions}
          className="px-4 py-2 rounded text-text-light transition duration-300 bg-secondary border-2 border-white hover:bg-main"
        >
          {showMySubmissions ? "All Sightings" : "My Sightings"}
        </button>
      </div>
      <Map
        defaultZoom={10}
        defaultCenter={{ lat: 40.71300493693606, lng: -74.0020943565909 }}
        //// Branson, MO:
        // defaultCenter={{ lat: 36.64398023185545, lng: -93.21784457195432 }}
        mapId="DEMO_MAP_ID"
        className="w-11/12 sm:w-5/6 lg:h-[600px] md:h-[500px] h-[400px] border-white border-2 rounded"
      >
        <PoiMarkers pois={filteredPois} />
      </Map>
    </div>
  );
};

export default MapContainer;
