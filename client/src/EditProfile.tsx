import React, { useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

const EditProfile: React.FC = () => {
  const { userId: activeUserId, token, logout } = useAuth();
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    location: "",
    imagePath: null as File | null,
    existingImagePath: "",
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [existingPassword, setExistingPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { id: profileId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const getUser = async () => {
      if (profileId && token) {
        try {
          const response = await axios.get(
            `https://branson-bear-spotter.onrender.com/api/users/${profileId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setUserData({
            firstName: response.data.firstName || "",
            lastName: response.data.lastName || "",
            username: response.data.username || "",
            location: response.data.location || "",
            imagePath: response.data.imagePath || "",
            existingImagePath: response.data.imagePath || "",
          });
        } catch (error: any) {
          toast.error(error.message);
        }
      }
    };

    getUser();
  }, [profileId, token]);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUserData({
        ...userData,
        imagePath: file,
      });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "existingPassword") setExistingPassword(value);
    if (name === "newPassword") setNewPassword(value);
    if (name === "confirmPassword") setConfirmPassword(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword && newPassword !== confirmPassword) {
      toast.error("New passwords do not match!");
      return;
    }

    const data = new FormData();
    data.append("firstName", userData.firstName);
    data.append("lastName", userData.lastName);
    data.append("username", userData.username);
    data.append("location", userData.location);
    if (userData.imagePath) {
      data.append("imagePath", userData.imagePath);
    } else {
      data.append("imagePath", userData.existingImagePath);
    }
    try {
      await axios.put(`https://branson-bear-spotter.onrender.com/api/users/${activeUserId}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (newPassword) {
        const passwordData = {
          existingPassword,
          newPassword,
        };
        await axios.put(
          `https://branson-bear-spotter.onrender.com/api/users/${activeUserId}/password`,
          passwordData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      setImagePreview(null);
      toast.success("Account updated!");
      navigate(`/profile/${profileId}`);
    } catch (error: any) {
      toast.error(error.response.data.error);
    }
  };

  const handleDeleteAccount = async () => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );

    if (isConfirmed) {
      try {
        await axios.delete(`https://branson-bear-spotter.onrender.com/api/users/${activeUserId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        logout();
        toast.success("Account deleted successfully.");
        navigate("/");
      } catch (error: any) {
        toast.error(error.message);
      }
    }
  };

  return (
    <div className="bg-main p-4 flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-4 text-text-light">
        Edit Profile Information
      </h2>
      <div className="w-full max-w-lg text-black bg-white p-6 rounded-lg shadow-md">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-lg font-semibold mb-2">
              First Name
            </label>
            <input
              type="text"
              name="firstName"
              value={userData.firstName}
              onChange={handleFormChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-lg font-semibold mb-2">
              Last Name
            </label>
            <input
              type="text"
              name="lastName"
              value={userData.lastName}
              onChange={handleFormChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-lg font-semibold mb-2">Username</label>
            <input
              type="text"
              name="username"
              value={userData.username}
              onChange={handleFormChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-lg font-semibold mb-2">Location</label>
            <input
              type="text"
              name="location"
              value={userData.location}
              onChange={handleFormChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-lg font-semibold mb-2">
              Profile Picture URL
            </label>
            {userData?.existingImagePath && (
              <div className="mt-4">
                <label>Current Image</label>
                <img
                  src={userData?.existingImagePath}
                  alt="Current Profile Picture"
                  className="w-full h-auto border border-gray-300 rounded"
                />
              </div>
            )}
            {imagePreview && (
              <div className="mt-4">
                <label>New Image</label>
                <img
                  src={imagePreview}
                  alt="Profile Picture Preview"
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
          <label className="block text-lg font-semibold mb-2">
            Update Password (Optional)
          </label>
          <div className="mb-4">
            <label className="block text-lg font-semibold mb-2">
              Existing Password
            </label>
            <input
              type="password"
              name="existingPassword"
              value={existingPassword}
              onChange={handlePasswordChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-lg font-semibold mb-2">
              New Password
            </label>
            <input
              type="password"
              name="newPassword"
              value={newPassword}
              onChange={handlePasswordChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-lg font-semibold mb-2">
              Confirm New Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={confirmPassword}
              onChange={handlePasswordChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="space-x-4">
            <button
              type="submit"
              className="bg-main text-text-light px-4 py-2 rounded hover:bg-secondary-dark transition duration-300"
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={() => navigate(`/profile/${activeUserId}`)}
              className="bg-secondary text-text-light px-4 py-2 rounded hover:bg-secondary-dark transition duration-300"
            >
              Cancel Changes
            </button>
          </div>
        </form>
        <button
          onClick={handleDeleteAccount}
          className="bg-red-500 text-text-light px-4 py-2 mt-4 rounded hover:bg-secondary-dark transition duration-300"
        >
          Delete Account
        </button>
      </div>
    </div>
  );
};

export default EditProfile;
