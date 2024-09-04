import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useAuth } from "./AuthContext";
import { Poi } from "./types/types";

interface AdminPoiFormProps {
  editPoi: (editedPoi: Poi) => void;
  deletePoi: (id: string) => void;
}

const AdminPoiForm: React.FC<AdminPoiFormProps> = ({ deletePoi, editPoi }) => {
  const { userId, token } = useAuth();
  const { id } = useParams();
  const [poi, setPoi] = useState({
    id: "",
    name: "",
    address: "",
    details: "",
    latitude: "",
    longitude: "",
    imagePath: null as File | null,
    existingImagePath: "",
    approvalStatus: "",
    approvalNotes: "",
    userId: "",
  });
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
          existingImagePath: response.data.imagePath || "",
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

  // Handle input changes
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setPoi({
      ...poi,
      [e.target.name]: e.target.value,
    });
    console.log(poi);
  };

  // Handle image changes
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPoi({
        ...poi,
        imagePath: e.target.files[0],
      });
    }
    console.log(poi);
  };

  // Handle Poi update submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const data = new FormData();
    data.append("id", poi.id);
    data.append("name", poi.name);
    data.append("address", poi.address);
    data.append("details", poi.details);
    data.append("latitude", poi.latitude);
    data.append("longitude", poi.longitude);
    data.append("approvalNotes", poi.approvalNotes);
    data.append("approvalStatus", poi.approvalStatus);
    data.append("userId", poi.userId);
    if (poi.imagePath) {
      data.append("imagePath", poi.imagePath);
    } else {
      data.append("imagePath", poi.existingImagePath);
    }
    try {
      console.log(data);
      const response = await axios.put(
        `http://localhost:5005/api/pois/${id}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      editPoi(response.data);
      console.log("POI submitted successfully:", response.data);
      window.location.href = "/admin-portal";
    } catch (error) {
      if (axios.isAxiosError(error) && error.message) {
        setErrors([error.message]);
      } else {
        setErrors(["An unexpected error occurred."]);
      }
      console.error("Error fetching POIs:", error);
    }
  };

  // Handle POI deletion
  const handleDelete = async () => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this POI? This action cannot be undone. As an alternative, consider changing the approval status."
    );
    if (isConfirmed) {
      try {
        await axios.delete(`http://localhost:5005/api/pois/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        deletePoi(id!);
        window.location.href = "/admin-portal";
      } catch (error) {
        if (axios.isAxiosError(error) && error.message) {
          setErrors([error.message]); // Assuming you want to store error messages
        } else {
          setErrors(["An unexpected error occurred."]); // Generic error message
        }
        console.error("Error fetching POIs:", error);
      }
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
          {poi.existingImagePath && !poi.imagePath && (
            <img
              src={poi.existingImagePath}
              alt="Current POI"
              style={{ maxWidth: "200px" }}
            />
          )}
          <input type="file" name="imagePath" onChange={handleFileChange} />
        </div>
        <div>
          <label>Approval Status:</label>
          <select
            name="approvalStatus"
            value={poi.approvalStatus}
            onChange={handleChange}
            required
          >
            <option>{poi.approvalStatus}</option>
            <option>active</option>
            <option>pending</option>
            <option>denied</option>
          </select>
        </div>
        <div>
          <label>Approval Notes:</label>
          <textarea
            name="approvalNotes"
            value={poi.approvalNotes}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Submit</button>
        <button type="button" onClick={handleDelete}>
          Delete
        </button>
      </form>
      {errors && errors.length > 0 ? <div>{errors}</div> : null}
    </>
  );
};

export default AdminPoiForm;
