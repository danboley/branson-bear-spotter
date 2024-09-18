import React, { useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { Poi } from "./types/types";
import DisplayPoiCard from "./DisplayPoiCard";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface UserProfileProps {
  pois: Poi[];
}

const UserProfile: React.FC<UserProfileProps> = ({ pois }) => {
  const { userId: activeUserId, token, logout } = useAuth();
  const [user, setUser] = useState<any | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    location: "",
    imagePath: null as File | null,
    existingImagePath: "",
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const { id: profileId } = useParams();
  const navigate = useNavigate();
  const isOwnProfile = activeUserId === profileId;

  const getUser = async () => {
    if (profileId && token) {
      try {
        const response = await axios.get(
          `http://localhost:5005/api/users/${profileId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUser(response.data);
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

  useEffect(() => {
    getUser();
  }, [profileId, token]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
      await axios.put(`http://localhost:5005/api/users/${activeUserId}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setImagePreview(null);
      getUser();
      setIsEditing(false);
      setUser(userData);
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
        await axios.delete(`http://localhost:5005/api/users/${activeUserId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        logout();
        toast.success("Account deleted successfully.");
        navigate("/");
      } catch (error: any) {
        console.log(error);
        toast.error(error.message);
      }
    }
  };

  const handleManageSubmissionsClick = () => {
    navigate(`/manage-submissions/${profileId}`);
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  const activeUserPois = pois.filter(
    (poi) => poi.approvalStatus === "active" && poi.userId === profileId
  );

  return (
    <div className="p-4 bg-main text-text-light min-h-screen flex flex-col">
      {!isEditing ? (
        <div>
          <div className="mb-4 flex justify-center">
            <img
              src={
                user.imagePath
                  ? `http://localhost:5005${user.imagePath}`
                  : "/stockprofilepicture.png"
              }
              alt="Profile"
              className="mt-2 w-32 h-32 object-cover rounded-full border-2 border-white"
            />
          </div>
          {isOwnProfile && (
            <div className="my-2 space-x-4 text-center">
              <button
                onClick={handleEditClick}
                className="bg-secondary border-2 border-white hover:bg-main text-text-light px-4 py-2 rounded hover:bg-secondary-dark transition duration-300"
              >
                Edit Profile
              </button>
              <button
                onClick={handleManageSubmissionsClick}
                className="bg-secondary border-2 border-white hover:bg-main text-text-light px-4 py-2 rounded hover:bg-secondary-dark transition duration-300"
              >
                Manage Submissions
              </button>
            </div>
          )}
          <h2 className="text-2xl font-bold mb-2 text-center">
            {user.username}
          </h2>

          <p className="text-center">
            {user.firstName} {user.lastName}
          </p>
          <p className="text-center">{user.location || ""}</p>
          {activeUserPois.length > 0 ? (
            <div>
              <h3 className="text-xl font-semibold mt-2 mb-4 text-center">
                Submissions:
              </h3>
              <div className="poi-cards-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {activeUserPois.map((poi) => (
                  <DisplayPoiCard key={poi.id} poi={poi} />
                ))}
              </div>
            </div>
          ) : (
            <div>
              <h3 className="text-xl font-semibold mt-2 mb-4 text-center">
                No submissions yet...
              </h3>
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <h2 className="text-2xl font-bold mb-4">Edit Profile Information</h2>
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
                <label className="block text-lg font-semibold mb-2">
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  value={userData.username}
                  onChange={handleFormChange}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-lg font-semibold mb-2">
                  Location
                </label>
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
                      src={`http://localhost:5005${userData?.existingImagePath}`}
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
              <div className="space-x-4">
                <button
                  type="submit"
                  className="bg-main text-text-light px-4 py-2 rounded hover:bg-secondary-dark transition duration-300"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
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
      )}
    </div>
  );
};

export default UserProfile;
