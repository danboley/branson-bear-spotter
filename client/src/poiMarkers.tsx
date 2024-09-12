import React, { useState, useRef, useEffect, useCallback } from "react";
import { AdvancedMarker, useMap, InfoWindow } from "@vis.gl/react-google-maps";
import { MarkerClusterer } from "@googlemaps/markerclusterer";
import type { Marker } from "@googlemaps/markerclusterer";
import { Poi } from "./types/types";

const PoiMarkers = ({ pois }: { pois: Poi[] }) => {
  const map = useMap();
  const [activeMarker, setActiveMarker] = useState<Poi | null>(null);
  const clusterer = useRef<MarkerClusterer | null>(null);
  const markersRef = useRef<{ [id: string]: Marker }>({});

  // Transform POI data to include location
  const transformedPois = pois
  .filter(poi => poi.approvalStatus === 'active')
  .map((poi) => {
    const location = { lat: poi.latitude!, lng: poi.longitude! };
    return {
      ...poi,
      location,
    };
  });

  // Pan To Click Event with enhanced InfoWindow handling
  const handleClick = useCallback(
    (ev: google.maps.MapMouseEvent, poi: Poi) => {
      if (!map || !ev.latLng) return;

      if (activeMarker && activeMarker.id === poi.id) return;

      map.panTo(ev.latLng);

      // Clear the activeMarker before setting a new one
      setActiveMarker(null);
      setTimeout(() => setActiveMarker(poi), 0);
    },
    [map, activeMarker]
  );

  interface RendererProps {
    count: number;
    position: google.maps.LatLng | google.maps.LatLngLiteral;
  }

  const renderer = {
    render: ({ count, position }: RendererProps) =>
      new google.maps.Marker({
        label: { text: String(count), color: "black", fontSize: "10px" },
        position,
        zIndex: Number(google.maps.Marker.MAX_ZINDEX) + count,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          fillColor: "#89a859",
          fillOpacity: 1,
          strokeColor: "#89a859",
          strokeWeight: 2,
          scale: 12,
        },
      }),
  };

  // Initialize and manage MarkerClusterer
  useEffect(() => {
    if (!map) return;

    // Initialize MarkerClusterer
    clusterer.current = new MarkerClusterer({
      map,
      markers: [],
      renderer,
    });

    // Cleanup on unmount
    return () => {
      if (clusterer.current) {
        clusterer.current.clearMarkers();
      }
    };
  }, [map]);

  // Update MarkerClusterer with new markers
  useEffect(() => {
    if (clusterer.current) {
      const currentMarkers = Object.values(markersRef.current);

      if (currentMarkers.length) {
        clusterer.current.clearMarkers();
        clusterer.current.addMarkers(currentMarkers);
      }
    }
  }, [markersRef.current]);

  // Manage marker refs
  const setMarkerRef = useCallback((marker: Marker | null, id: string) => {
    if (marker) {
      markersRef.current[id] = marker;
    } else {
      delete markersRef.current[id];
    }

    // Ensure clusterer is updated
    if (clusterer.current) {
      const currentMarkers = Object.values(markersRef.current);

      if (currentMarkers.length) {
        clusterer.current.clearMarkers();
        clusterer.current.addMarkers(currentMarkers);
      }
    }
  }, []);

  return (
    <>
      {transformedPois.map((poi) => (
        <AdvancedMarker
          key={poi.id}
          position={poi.location}
          ref={(marker) => setMarkerRef(marker, poi.id)}
          clickable={true}
          onClick={(ev) => handleClick(ev, poi)}
        >
          <img
            src="/bransonbear.png"
            alt={poi.name}
            style={{ width: "35px", height: "35px" }}
          />
        </AdvancedMarker>
      ))}
      {activeMarker && (
        <InfoWindow
          position={activeMarker.location}
          onCloseClick={() => setActiveMarker(null)}
          pixelOffset={[0, -40]}
        >
          <div>
            <p className="text-xl font-bold">{activeMarker.name}</p>
            <a className="text-main" href={`http://localhost:5173/pois/${activeMarker.id}`}>
              <p>More Details</p>
            </a>
            {/* <p>Latitude: {activeMarker.location?.lat}</p>
            <p>Longitude: {activeMarker.location?.lng}</p> */}
            {/* <p>Address: {activeMarker.address}</p>
            <p>Submitted By: {activeMarker.User.username}</p> */}
            <p>Details: {activeMarker.details}</p>
            {activeMarker.imagePath && activeMarker.imagePath.trim() !== "" ? (
              <img className="w-48 h-auto"src={`http://localhost:5005${activeMarker.imagePath}`} />
            ) : (<img className="w-48 h-auto" src={`public/bransonbear.png`} />)}
          </div>
        </InfoWindow>
      )}
    </>
  );
};

export default PoiMarkers;
