import React from "react";
import { Poi } from "./types/types";

interface PoiCardProps {
  poi: Poi;
}

const DisplayPoiCard: React.FC<PoiCardProps> = ({ poi }) => {
  return (
    <div className=" bg-white shadow-md p-4 rounded-lg">
      {poi?.imagePath ? (
        <img
          src={poi?.imagePath}
          alt={poi.name}
          className="w-10% h-auto object-cover rounded"
        />
      ) : (
        <img
          src={`/bransonbear.png`}
          alt={poi.name}
          className="w-10% h-auto object-cover rounded"
        />
      )}
      <a href={`https://branson-bear.com/pois/${poi.id}`}>
        <p className="text-main text-lg font-semibold mt-2 hover:text-secondary transition duration-300">
          {poi.name}
        </p>
      </a>
      <p className="poi-address text-sm text-black">{poi.address}</p>
      <p className="poi-details text-sm text-black mt-2">{poi.details}</p>
    </div>
  );
};

export default DisplayPoiCard;
