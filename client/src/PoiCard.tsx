import React from "react";
import { Poi } from "./types/types";

interface PoiCardProps {
  poi: Poi;
}

const PoiCard: React.FC<PoiCardProps> = ({ poi }) => {
  return (
    <div className="poi-card bg-white shadow-md p-4 rounded-lg">
      {poi.imagePath && (
        <img
          src={poi.imagePath}
          alt={poi.name}
          className="poi-image w-full h-32 object-cover rounded"
        />
      )}
      <a href={`http://localhost:5173/pois/${poi.id}`}>
        <p className="poi-name text-lg font-semibold mt-2">{poi.name}</p>
      </a>
      <p className="poi-address text-sm text-gray-600">{poi.address}</p>
      <p className="poi-details text-sm text-gray-600 mt-2">{poi.details}</p>
    </div>
  );
};

export default PoiCard;
