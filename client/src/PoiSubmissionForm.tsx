import React, { useState, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";

const PoiSubmissionForm: React.FC = ({ addPoi }) => {
  const { userId, token } = useAuth();
  const [errors, setErrors] = useState<[] | null>(null);
  const [poi, setPoi] = useState({
    name: "",
    address: "",
    details: "",
    latitude: "",
    longitude: "",
    imagePath: null as File | null,
    approvalNotes: "",
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setPoi({
      ...poi,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPoi({
        ...poi,
        imagePath: e.target.files[0],
      });
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const data = new FormData();
    data.append("name", poi.name);
    data.append("address", poi.address);
    data.append("details", poi.details);
    data.append("latitude", poi.latitude);
    data.append("longitude", poi.longitude);
    data.append("approvalNotes", poi.approvalNotes);
    if (poi.imagePath) {
      data.append("imagePath", poi.imagePath);
    }
    if (userId) {
      data.append("userId", userId);
    } else {
      console.error("User ID is missing");
      return;
    }
    try {
      const response = await axios.post(
        "http://localhost:5005/api/pois",
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      addPoi(response.data);
      console.log("POI submitted successfully:", response.data);
      window.location.href = "/map";
    } catch (error: any) {
      setErrors(error);
      console.error("Error submitting POI:", error);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Location Name:</label>
          <input
            type="text"
            name="name"
            value={poi.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Address:</label>
          <input
            type="text"
            name="address"
            value={poi.address}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Details:</label>
          <textarea
            name="details"
            value={poi.details}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Latitude:</label>
          <input
            type="number"
            name="latitude"
            value={poi.latitude}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Longitude:</label>
          <input
            type="number"
            name="longitude"
            value={poi.longitude}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Image:</label>
          <input type="file" name="imagePath" onChange={handleFileChange} />
        </div>
        <button type="submit">Submit</button>
      </form>
      {errors && errors.length > 0 ? <div>{errors}</div> : null}
    </>
  );
};

export default PoiSubmissionForm;
