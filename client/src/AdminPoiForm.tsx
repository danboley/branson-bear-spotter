import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "./AuthContext";
import { Poi } from "./types/types";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface AdminPoiFormProps {
  editPoi: (editedPoi: Poi) => void;
  deletePoi: (id: string) => void;
}

const AdminPoiForm: React.FC<AdminPoiFormProps> = ({ deletePoi, editPoi }) => {
  const { userId, token } = useAuth();
  const navigate = useNavigate();
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
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Get Poi by Id
  useEffect(() => {
    const getPoiById = async () => {
      try {
        const response = await axios.get(
          `https://branson-bear-spotter.onrender.com/api/pois/${id}`
        );
        setPoi({
          ...response.data,
          existingImagePath: response.data.imagePath || "",
        });
      } catch (error: any) {
        toast.error(error.response.data.error);
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
    if (poi.userId === "") {
      data.append("userId", "null");
    } else {
      data.append("userId", poi.userId);
    }
    if (poi.imagePath) {
      data.append("imagePath", poi.imagePath);
    } else {
      data.append("imagePath", poi.existingImagePath);
    }
    try {
      const response = await axios.put(
        `https://branson-bear-spotter.onrender.com/api/pois/${id}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      editPoi(response.data);
      toast.success("POI updated successfully.");
      navigate("/admin-portal");
    } catch (error: any) {
      toast.error(error.response.data.error);
    }
  };

  // Handle POI deletion
  const handleDelete = async () => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this POI? This action cannot be undone. As an alternative, consider changing the approval status."
    );
    if (isConfirmed) {
      try {
        await axios.delete(`https://branson-bear-spotter.onrender.com/api/pois/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        deletePoi(id!);
        toast.success("POI deleted successfully.");
        navigate("/admin-portal");
      } catch (error: any) {
        toast.error(error.response.data.error);
      }
    }
  };

  // Handle edit cancellation
  const cancelEdit = () => {
    navigate("/admin-portal");
  };

  return (
    <div className="p-4 bg-main min-h-screen flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-4 text-text-light">
        Admin Sighting Form
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
          {poi?.existingImagePath && (
            <div className="mt-4">
              <label>Current Image</label>
              <img
                src={`https://branson-bear-spotter.onrender.com${poi?.existingImagePath}`}
                alt="Current POI"
                className="w-full h-auto border border-gray-300 rounded"
              />
            </div>
          )}
          {imagePreview && (
            <div className="mt-4">
              <label>New Image</label>
              <img
                src={imagePreview}
                alt="Image preview"
                className="w-full h-auto border border-gray-300 rounded"
              />
            </div>
          )}
          <input
            type="file"
            name="imagePath"
            className="mt-4 w-full p-2 border border-gray-300 rounded"
            onChange={handleFileChange}
          />
        </div>
        <div className="mb-4">
          <label className="block text-lg font-semibold mb-2">
            Approval Status
          </label>
          <select
            name="approvalStatus"
            value={poi.approvalStatus}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded"
          >
            <option>{poi.approvalStatus}</option>
            <option>active</option>
            <option>pending</option>
            <option>denied</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-lg font-semibold mb-2">
            Approval Notes
          </label>
          <textarea
            name="approvalNotes"
            value={poi.approvalNotes}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="flex space-x-4">
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
          <button
            type="button"
            onClick={handleDelete}
            className="bg-red-500 text-text-light px-4 py-2 rounded hover:bg-secondary-dark transition duration-300"
          >
            Delete
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminPoiForm;
