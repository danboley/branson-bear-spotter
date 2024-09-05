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
    <div>
      {!isEditing ? (
        <>
          <h2>Profile Information</h2>
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
            <div>
              <strong>Profile Picture:</strong>
              <img src={user.profilePicture} alt="Profile" />
            </div>
          )}

          {isOwnProfile && (
            <>
              <button onClick={handleEditClick}>Edit</button>
              <button onClick={handleDeleteAccount}>Delete Account</button>
            </>
          )}

          <h3 className="mt-4">
            Submissions by {user.username || "this user"}
          </h3>
          <div className="poi-cards-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {userPois.map((poi) => (
              <PoiCard key={poi.id} poi={poi} />
            ))}
          </div>
        </>
      ) : (
        <>
          <h2>Edit Profile Information</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label>First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleFormChange}
              />
            </div>
            <div>
              <label>Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleFormChange}
              />
            </div>
            <div>
              <label>Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleFormChange}
              />
            </div>
            <div>
              <label>Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleFormChange}
              />
            </div>
            <div className="mb-4">
              <label>Profile Picture URL</label>
              <input
                type="text"
                name="profilePicture"
                value={formData.profilePicture}
                onChange={handleFormChange}
              />
            </div>
            <button type="submit">Save</button>
            <button type="button" onClick={() => setIsEditing(false)}>
              Cancel
            </button>
          </form>
        </>
      )}
    </div>
  );
};

export default UserProfile;
