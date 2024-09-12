import React, { useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { Poi } from "./types/types";
import PoiCard from "./PoiCard";

interface UserProfileProps {
  pois: Poi[];
}

const UserProfile: React.FC<UserProfileProps> = ({ pois }) => {
  const { userId: loggedInUserId, token, logout } = useAuth();
  const [user, setUser] = useState<any | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    location: "",
    profilePicture: "",
  });

  const { id: profileId } = useParams();
  const navigate = useNavigate();
  const isOwnProfile = loggedInUserId === profileId;

  useEffect(() => {
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
          setFormData({
            firstName: response.data.firstName || "",
            lastName: response.data.lastName || "",
            username: response.data.username || "",
            location: response.data.location || "",
            profilePicture: response.data.profilePicture || "",
          });
        } catch (error) {
          console.error("Error fetching user data", error);
        }
      }
    };

    getUser();
  }, [profileId, token]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:5005/api/users/${loggedInUserId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setIsEditing(false);
      setUser(formData);
    } catch (error) {
      console.error("Error updating user data", error);
    }
  };

  const handleDeleteAccount = async () => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );

    if (isConfirmed) {
      try {
        await axios.delete(
          `http://localhost:5005/api/users/${loggedInUserId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        logout();
        navigate("/");
      } catch (error) {
        console.error("Error deleting account", error);
      }
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  const userPois = pois.filter((poi) => poi.userId === profileId);

  return (
    <div className="p-4 bg-main text-text-light min-h-screen flex flex-col items-center">
      {!isEditing ? (
        <>
          <h2 className="text-2xl font-bold mb-4">{user.username}'s Profile</h2>
          <p>
            <strong>First Name:</strong> {user.firstName}
          </p>
          <p>
            <strong>Last Name:</strong> {user.lastName}
          </p>
          <p>
            <strong>Username:</strong> {user.username}
          </p>
          <p>
            <strong>Location:</strong> {user.location || ""}
          </p>
          {user.profilePicture && (
            <div className="mb-4">
              <strong>Profile Picture:</strong>
              <img
                src={user.profilePicture}
                alt="Profile"
                className="mt-2 w-32 h-32 object-cover rounded-full"
              />
            </div>
          )}

          {isOwnProfile && (
            <div className="my-2 space-x-4">
              <button
                onClick={handleEditClick}
                className="bg-secondary text-text-light px-4 py-2 rounded hover:bg-secondary-dark transition duration-300"
              >
                Edit Profile
              </button>
            </div>
          )}

          <h3 className="text-xl font-semibold mt-2 mb-4">
            Submissions by {user.username || "this user"}:
          </h3>
          <div className="poi-cards-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {userPois.map((poi) => (
              <PoiCard key={poi.id} poi={poi} />
            ))}
          </div>
        </>
      ) : (
        <>
          <h2 className="text-2xl font-bold mb-4">Edit Profile Information</h2>
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-lg text-black bg-white p-6 rounded-lg shadow-md"
          >
            <div className="mb-4">
              <label className="block text-lg font-semibold mb-2">
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
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
                value={formData.lastName}
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
                value={formData.username}
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
                value={formData.location}
                onChange={handleFormChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-lg font-semibold mb-2">
                Profile Picture URL
              </label>
              <input
                type="text"
                name="profilePicture"
                value={formData.profilePicture}
                onChange={handleFormChange}
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
              onClick={() => setIsEditing(false)}
              className="bg-secondary text-text-light px-4 py-2 rounded hover:bg-secondary-dark transition duration-300"
            >
              Cancel Changes
            </button>
            <button
              onClick={handleDeleteAccount}
              className="bg-red-500 text-text-light px-4 py-2 rounded hover:bg-secondary-dark transition duration-300"
            >
              Delete Account
            </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
};

export default UserProfile;
