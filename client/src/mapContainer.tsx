import { Map, MapCameraChangedEvent } from "@vis.gl/react-google-maps";
import PoiMarkers from "./poiMarkers";
import { locations } from "./types/locations";

const MapContainer = () => (
  <Map
    defaultZoom={13}
    defaultCenter={{ lat: 40.71300493693606, lng: -74.0020943565909 }}
    //// Branson, MO:
    // defaultCenter={{ lat: 36.64398023185545, lng: -93.21784457195432 }}
    mapId="DEMO_MAP_ID"
    onCameraChanged={(ev: MapCameraChangedEvent) =>
      console.log("camera changed:", ev.detail.center, "zoom:", ev.detail.zoom)
    }
  >
    <PoiMarkers pois={locations} />
  </Map>
);

export default MapContainer;
