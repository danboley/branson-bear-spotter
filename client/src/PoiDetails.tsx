import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Poi } from "./types/types";

const PoiDetails: React.FC = () => {
  const { id } = useParams();
  const [poi, setPoi] = useState<Poi | null>(null)
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
        console.log("response:", response);
        console.log("response.data:", response.data);
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
    <div>
      <h1>PoiDetails</h1>
      <p>{poi?.name}</p>
      <img src={`http://localhost:5005${poi?.imagePath}`}></img>
      <p>{poi?.address}</p>
      <p>Submitted By: {poi?.User?.username}</p>
    </div>
  );
};

export default PoiDetails;
