import React, { useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Poi } from "./types/types";
import { toast } from "react-toastify";
import ManagePoiCard from "./ManagePoiCard";

const ManageSubmissions: React.FC = () => {
  const { userId, token } = useAuth();
  const [userPois, setUserPois] = useState<Poi[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const getUserPois = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5005/api/pois/user/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUserPois(response.data);
      } catch (error: any) {
        error.status === 404
          ? toast.error("No submissions found")
          : toast.error(error.message);
      }
    };

    getUserPois();
  }, [userId, token]);

  const handleEditClick = (id: string) => {
    navigate(`/edit-submission/${id}`);
  };

  return (
    <div className="p-4 bg-main text-text-light min-h-screen text-center">
      <h1 className="text-2xl font-bold mb-4">
        Manage Your Sighting Submissions
      </h1>
      <h2 className="mb-4">
        Click on a sighting to make edits and address approval notes.
      </h2>
      <h2 className="mb-6">
        If a sighting has been approved, no edits needed!
      </h2>
      {userPois.length > 0 ? (
        <div className="poi-cards-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {userPois.map((poi) => (
            <div
              key={poi.id}
              className="cursor-pointer"
              onClick={
                poi?.approvalStatus === "active"
                  ? () => toast.success("Poi already approved!")
                  : () => handleEditClick(poi.id)
              }
            >
              <ManagePoiCard poi={poi} />
            </div>
          ))}
        </div>
      ) : (
        <p>No submissions yet!</p>
      )}
    </div>
  );
};

export default ManageSubmissions;
