import { Map } from "@vis.gl/react-google-maps";
import PoiMarkers from "./poiMarkers";
import { Poi } from "./types/types";

interface MapContainerProps {
  pois: Poi[];
}

const MapContainer: React.FC<MapContainerProps> = ({ pois }) => {
  return (
    <div className="bg-main p-4 flex flex-col min-h-screen items-center">
      <h1 className="py-4 text-4xl font-bold mb-4 text-center text-text-light">
        Find Branson Bear Worldwide
      </h1>
      <Map
        defaultZoom={10}
        defaultCenter={{ lat: 40.71300493693606, lng: -74.0020943565909 }}
        //// Branson, MO:
        // defaultCenter={{ lat: 36.64398023185545, lng: -93.21784457195432 }}
        mapId="DEMO_MAP_ID"
        className="w-11/12 sm:w-5/6 lg:h-[600px] md:h-[500px] h-[400px] border-white border-2 rounded"
      >
        {" "}
        <PoiMarkers pois={pois} />
      </Map>
    </div>
  );
};

export default MapContainer;
