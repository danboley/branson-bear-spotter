import { Map, MapCameraChangedEvent } from "@vis.gl/react-google-maps";
import PoiMarkers from "./poiMarkers";
import { Poi } from "./types/types";

interface MapContainerProps {
  pois: Poi[];
}

const MapContainer: React.FC<MapContainerProps> = ({ pois }) => {
  return (
    <Map
      defaultZoom={13}
      defaultCenter={{ lat: 40.71300493693606, lng: -74.0020943565909 }}
      //// Branson, MO:
      // defaultCenter={{ lat: 36.64398023185545, lng: -93.21784457195432 }}
      mapId="DEMO_MAP_ID"
      // onCameraChanged={(ev: MapCameraChangedEvent) =>
      //   console.log("camera changed:", ev.detail.center, "zoom:", ev.detail.zoom)
      // }
    >
      {" "}
      <PoiMarkers pois={pois} />
    </Map>
  );
};

export default MapContainer;
