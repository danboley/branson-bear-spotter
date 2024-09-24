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
      <p className="text-main text-lg font-semibold my-1 mt-2 transition duration-300">
        {poi.name}
      </p>
      <p className="poi-address text-sm text-black my-1">
        Approval Status: {poi.approvalStatus}
      </p>
      <p className="poi-address text-sm text-black my-1">{poi.address}</p>
      <p className="poi-details text-sm text-black my-1">{poi.details}</p>
    </div>
  );
};

export default ManagePoiCard;
