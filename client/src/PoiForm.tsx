import React, { useState, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";

const PoiSubmissionForm = () => {
  const { userId, token } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    details: "",
    latitude: "",
    longitude: "",
    image: null as File | null,
    approvalNotes: "",
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    console.log(formData);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({
        ...formData,
        image: e.target.files[0],
      });
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const data = new FormData();
    data.append("name", formData.name);
    data.append("address", formData.address);
    data.append("details", formData.details);
    data.append("latitude", formData.latitude);
    data.append("longitude", formData.longitude);
    data.append("approvalNotes", formData.approvalNotes);
    if (formData.image) {
      data.append("image", formData.image);
    }
    if (userId) {
      data.append("userId", userId);
    } else {
      console.error("User ID is missing");
      return;
    }
    console.log(data);
    try {
      console.log(data);
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
      console.log("POI submitted successfully:", response.data);
    } catch (error) {
      console.error("Error submitting POI:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Location Name:</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Address:</label>
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Details:</label>
        <textarea
          name="details"
          value={formData.details}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Latitude:</label>
        <input
          type="number"
          name="latitude"
          value={formData.latitude}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Longitude:</label>
        <input
          type="number"
          name="longitude"
          value={formData.longitude}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Image:</label>
        <input type="file" name="image" onChange={handleFileChange} />
      </div>
      <button type="submit">Submit</button>
    </form>
  );
};

export default PoiSubmissionForm;
