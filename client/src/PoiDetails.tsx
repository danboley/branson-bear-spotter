import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Poi } from "./types/types";

const PoiDetails: React.FC = () => {
  const { id } = useParams();
  const [poi, setPoi] = useState<Poi | null>(null);
  const [errors, setErrors] = useState<string[] | null>(null);

  // Get Poi by Id
  useEffect(() => {
    const getPoiById = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5005/api/pois/${id}`
        );
        setPoi({
          ...response.data,
        });
      } catch (error) {
        if (axios.isAxiosError(error) && error.message) {
          setErrors([error.message]);
        } else {
          setErrors(["An unexpected error occurred."]);
        }
        console.error("Error fetching POIs:", error);
      }
    };
    getPoiById();
  }, [id]);

  return (
    <div className="bg-main p-4 flex flex-col min-h-screen items-center text-center text-text-light">
      <h1 className="text-4xl font-bold mb-4">Sighting Details</h1>
      <h2 className="text-3xl font-bold mb-4 sm:w-1/2 w-5/6">{poi?.name}</h2>
      <img
        className="max-w-lg w-full h-auto mb-4"
        src={`http://localhost:5005${poi?.imagePath}`}
        alt={poi?.name}
      ></img>
      <h3 className="text-lg font-semibold mb-4 sm:w-1/2 w-5/6">
        {poi?.address}
      </h3>
      {poi?.User?.id !== undefined ? (
        <div className="flex items-center text-center mb-4">
          <h3 className="text-lg font-semibold mr-2">Submitted By:</h3>
          <a href={`http://localhost:5173/profile/${poi?.User?.id}`}>
            <p className="text-lg font-semibold hover:text-secondary transition duration-300">
              {poi?.User?.username}
            </p>
          </a>
        </div>
      ) : (
        <div className="flex items-center text-center mb-4">
          <h3 className="text-lg font-semibold mr-2">Submitted By:</h3>
          <p className="text-lg font-semibold">Inactive User</p>
        </div>
      )}
      <p className="max-w-lg w-full">Details: {poi?.details}</p>
    </div>
  );
};

export default PoiDetails;
