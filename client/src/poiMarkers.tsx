import React, { useState, useRef, useEffect, useCallback } from "react";
import { AdvancedMarker, useMap, InfoWindow } from "@vis.gl/react-google-maps";
import { MarkerClusterer } from "@googlemaps/markerclusterer";
import type { Marker } from "@googlemaps/markerclusterer";

type Poi = { key: string; name: string; location: google.maps.LatLngLiteral };

const PoiMarkers = ({ pois }: { pois: Poi[] }) => {
  const map = useMap();
  const [activeMarker, setActiveMarker] = useState<Poi | null>(null);
  const clusterer = useRef<MarkerClusterer | null>(null);
  const markersRef = useRef<{ [key: string]: Marker }>({});

  // Pan To Click Event with enhanced InfoWindow handling
  const handleClick = useCallback(
    (ev: google.maps.MapMouseEvent, poi: Poi) => {
      if (!map || !ev.latLng) return;

      if (activeMarker && activeMarker.key === poi.key) return;

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
  const setMarkerRef = useCallback((marker: Marker | null, key: string) => {
    if (marker) {
      markersRef.current[key] = marker;
    } else {
      delete markersRef.current[key];
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
      {pois.map((poi) => (
        <AdvancedMarker
          key={poi.key}
          position={poi.location}
          ref={(marker) => setMarkerRef(marker, poi.key)}
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
            <h2>Location Info</h2>
            <p>{activeMarker.name}</p>
            <p>Latitude: {activeMarker.location.lat}</p>
            <p>Longitude: {activeMarker.location.lng}</p>
          </div>
        </InfoWindow>
      )}
    </>
  );
};

export default PoiMarkers;
