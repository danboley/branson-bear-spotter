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
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    location: "",
    imagePath: null as File | null,
    existingImagePath: "",
  });

  const { id: profileId } = useParams();
  const navigate = useNavigate();
  const isOwnProfile = activeUserId === profileId;

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
      <div>
        <div className="mb-4 flex justify-center">
          <img
            src={
              user.imagePath
                ? `https://branson-bear-spotter.onrender.com${user.imagePath}`
                : "/stockprofilepicture.png"
            }
            alt="Profile"
            className="mt-2 w-32 h-32 object-cover rounded-full border-2 border-white"
          />
        </div>
        {isOwnProfile && (
          <div className="my-2 space-x-4 text-center">
            <button
              onClick={() => navigate(`/edit-profile/${profileId}`)}
              className="bg-secondary border-2 border-white hover:bg-main text-text-light px-4 py-2 rounded hover:bg-secondary-dark transition duration-300"
            >
              Edit Profile
            </button>
            <button
              onClick={handleManageSubmissionsClick}
              className="bg-secondary border-2 border-white hover:bg-main text-text-light px-4 py-2 rounded hover:bg-secondary-dark transition duration-300"
            >
              Manage Sightings
            </button>
          </div>
        )}
        <h2 className="text-2xl font-bold mb-2 text-center">{user.username}</h2>

        <p className="text-center">
          {user.firstName} {user.lastName}
        </p>
        <p className="text-center">{user.location || ""}</p>
        {activeUserPois.length > 0 ? (
          <div>
            <h3 className="text-xl font-semibold mt-2 mb-4 text-center">
              Sightings:
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
              No sightings yet...
            </h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
