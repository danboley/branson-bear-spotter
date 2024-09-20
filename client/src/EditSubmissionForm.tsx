import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "./AuthContext";
import { toast } from "react-toastify";
import { Poi } from "./types/types";

interface EditSubmissionFormProps {
  editPoi: (editedPoi: Poi) => void;
}

const EditSubmissionForm: React.FC<EditSubmissionFormProps> = ({ editPoi }) => {
  const { id } = useParams<{ id: string }>();
  const { userId, token } = useAuth();
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
  const navigate = useNavigate();

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
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (poi) {
      setPoi({
        ...poi,
        [e.target.name]: e.target.value,
      });
    }
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
    if (poi) {
      const data = new FormData();
      data.append("name", poi.name);
      data.append("address", poi.address);
      data.append("details", poi.details);
      data.append("latitude", poi.latitude);
      data.append("longitude", poi.longitude);
      if (poi.imagePath) {
        data.append("imagePath", poi.imagePath);
      } else {
        data.append("existingImagePath", poi.existingImagePath);
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
        toast.success("Submission updated successfully.");
        navigate(`/manage-submissions/${userId}`);
      } catch (error: any) {
        toast.error(error.message);
      }
    }
  };

  if (!poi) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4 bg-main min-h-screen flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-4 text-text-light">
        Edit Submission
      </h1>
      {poi.approvalNotes ? (
        <div className="flex-column w-full max-w-lg mb-4 rounded-lg shadow-md bg-white p-6 text-center justify-center items-center">
          <div className="mb-2">
            <h2 className="text-lg font-semibold mr-2">Approval Status:</h2>
            <p>{poi.approvalStatus}</p>
          </div>
          <div>
            <h2 className="text-lg font-semibold mr-2">Approval Notes: </h2>
            <p>{poi.approvalNotes}</p>
          </div>
        </div>
      ) : (
        <div className="flex w-full max-w-lg mb-4 rounded-lg shadow-md bg-white p-6 text-center justify-center items-center">
          <h2 className="text-lg font-semibold mr-2">Approval Status:</h2>
          <p className="">{poi.approvalStatus}</p>
        </div>
      )}
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
          {poi.existingImagePath && (
            <div className="mt-4">
              <label>Current Image</label>
              <img
                src={`https://branson-bear-spotter.onrender.com${poi.existingImagePath}`}
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
        <div className="flex space-x-4">
          <button
            type="submit"
            className="bg-main text-text-light px-4 py-2 rounded hover:bg-secondary-dark transition duration-300"
          >
            Save Changes
          </button>
          <button
            type="button"
            onClick={() => navigate(`/manage-submissions/${userId}`)}
            className="bg-secondary text-text-light px-4 py-2 rounded hover:bg-secondary-dark transition duration-300"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditSubmissionForm;
