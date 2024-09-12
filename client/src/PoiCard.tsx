import React from "react";
import { Poi } from "./types/types";

interface PoiCardProps {
  poi: Poi;
}

const PoiCard: React.FC<PoiCardProps> = ({ poi }) => {
  console.log("Poi:", poi);
  return (
    <div className="poi-card bg-white shadow-md p-4 rounded-lg">
      {poi?.imagePath ? (
        <img
          src={`http://localhost:5005${poi?.imagePath}`}
          alt={poi.name}
          className="poi-image w-10% h-auto object-cover rounded"
        />
      ) : (
        <img
          src={`/public/bransonbear.png`}
          alt={poi.name}
          className="poi-image w-10% h-auto object-cover rounded"
        />
      )}
      <a href={`http://localhost:5173/pois/${poi.id}`}>
        <p className="poi-name text-lg font-semibold text-black mt-2">{poi.name}</p>
      </a>
      <p className="poi-address text-sm text-black">{poi.address}</p>
      <p className="poi-details text-sm text-black mt-2">{poi.details}</p>
    </div>
  );
};

export default PoiCard;
