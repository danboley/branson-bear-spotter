import React, { useState, ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "./AuthContext";
import { Poi } from "./types/types";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface PoiSubmissionFormProps {
  addPoi: (newPoi: Poi) => void;
}

const PoiSubmissionForm: React.FC<PoiSubmissionFormProps> = ({ addPoi }) => {
  const { userId, token } = useAuth();
  const navigate = useNavigate();
  const [poi, setPoi] = useState({
    name: "",
    address: "",
    details: "",
    latitude: "",
    longitude: "",
    imagePath: null as File | null,
    approvalNotes: "",
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Handle input changes
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setPoi({
      ...poi,
      [e.target.name]: e.target.value,
    });
  };

  // Handle image changes
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPoi({
        ...poi,
        imagePath: file,
      });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Handle Poi submission
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
      toast.error("Must be a registered user.");
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
      toast.success("Submission successful! Pending approval.");
      navigate("/map");
    } catch (error: any) {
      toast.error(error.response.data.error);
      console.log(error);
    }
  };

  // Handle edit cancellation
  const cancelEdit = () => {
    navigate("/map");
  };

  return (
    <div className="p-4 bg-main min-h-screen flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-4 text-text-light">
        Report a Branson Bear Sighting!
      </h1>
      <form
        className="w-full max-w-lg text-black bg-white p-6 rounded-lg shadow-md"
        onSubmit={handleSubmit}
      >
        <div className="mb-4">
          <label className="block text-lg font-semibold mb-2">
            Location Name
          </label>
          <input
            type="text"
            name="name"
            value={poi.name}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-lg font-semibold mb-2">Address</label>
          <input
            type="text"
            name="address"
            value={poi.address}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-lg font-semibold mb-2">Details</label>
          <textarea
            name="details"
            value={poi.details}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-lg font-semibold mb-2">Latitude</label>
          <input
            type="number"
            name="latitude"
            value={poi.latitude}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-lg font-semibold mb-2">Longitude</label>
          <input
            type="number"
            name="longitude"
            value={poi.longitude}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-lg font-semibold mb-2">Image</label>
          <input
            type="file"
            name="imagePath"
            className="w-full p-2 border border-gray-300 rounded"
            onChange={handleFileChange}
          />
          {imagePreview && (
            <div className="mt-4">
              <img
                src={imagePreview}
                alt="Image preview"
                className="w-full h-auto border border-gray-300 rounded"
              />
            </div>
          )}
        </div>
        <div className="space-x-4">
          <button
            type="submit"
            className="bg-main text-text-light px-4 py-2 rounded hover:bg-secondary-dark transition duration-300"
          >
            Submit
          </button>
          <button
            type="button"
            onClick={() => cancelEdit()}
            className="bg-secondary text-text-light px-4 py-2 rounded hover:bg-secondary-dark transition duration-300"
          >
            Cancel Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default PoiSubmissionForm;
