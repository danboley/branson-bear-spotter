import React from "react";
import { Poi } from "./types/types";

interface PoiCardProps {
  poi: Poi;
}

const ManagePoiCard: React.FC<PoiCardProps> = ({ poi }) => {
  return (
    <div className=" bg-white shadow-md p-4 rounded-lg">
      {poi?.imagePath ? (
        <img
          src={`http://localhost:5005${poi?.imagePath}`}
          alt={poi.name}
          className="w-10% h-auto object-cover rounded"
        />
      ) : (
        <img
          src={`/public/bransonbear.png`}
          alt={poi.name}
          className="w-10% h-auto object-cover rounded"
        />
      )}
      <a href={`http://localhost:5173/edit-submission/${poi.id}`}>
        <p className="text-main text-lg font-semibold mt-2 hover:text-secondary transition duration-300">
          {poi.name}
        </p>
      </a>
      <p className="poi-address text-sm text-black">{poi.address}</p>
      <p className="poi-details text-sm text-black mt-2">{poi.details}</p>
    </div>
  );
};

export default ManagePoiCard;
