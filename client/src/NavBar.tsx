import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "./AuthContext";

const NavBar: React.FC = () => {
  const { token, logout, isAdmin } = useAuth();

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white">
          <Link to="/" className="mr-4">
            Home
          </Link>
          <Link to="/map" className="mr-4">
            Map
          </Link>
          <Link to="/submissions" className="mr-4">
            Submit POI
          </Link>
          {isAdmin && (
            <Link to="/admin-portal" className="mr-4 text-yellow-500">
              Admin Portal
            </Link>
          )}
          {token && (
            <Link to="/profile" className="mr-4 text-white">
              My Profile
            </Link>
          )}
        </div>
        <div>
          {token ? (
            <button
              onClick={() => {
                logout();
                window.location.href = "/login";
              }}
              className="text-white bg-red-500 px-4 py-2 rounded"
            >
              Logout
            </button>
          ) : (
            <>
              <Link to="/login" className="mr-4 text-white">
                Login
              </Link>
              <Link to="/register" className="text-white">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
