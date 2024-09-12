import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "./AuthContext";

const NavBar: React.FC = () => {
  const { token, userId, logout, isAdmin } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleMenuToggle = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className="bg-main text-text-light p-4 border-b-2 border-white relative">
      <div className="container mx-auto flex items-center justify-between">
        <div>
          <Link
            to="/"
            className="text-xl flex space-x-2 font-bold hover:text-secondary transition duration-300"
          >
            <img
              className="w-10 sm:w-8 h-auto -my-1.5 sm:-my-0.5"
              src="/bransonbear.png"
            ></img>
            <p className="hidden sm:block">Branson Bear Tracker</p>
            <p className="block sm:hidden">Branson Bear</p>
          </Link>
        </div>

        {/* Hamburger Icon */}
        <div className="block lg:hidden absolute right-4 top-3">
          <button
            onClick={handleMenuToggle}
            className="text-2xl focus:outline-none"
          >
            {isMenuOpen ? <span>&times;</span> : <span>&#9776;</span>}
          </button>
        </div>

        {/* Desktop Menu */}
        <div className="hidden items-center lg:flex space-x-4 ml-auto">
          <Link to="/" className="hover:text-secondary transition duration-300">
            Home
          </Link>
          <Link
            to="/about"
            className="hover:text-secondary transition duration-300"
          >
            About
          </Link>
          <Link
            to="/map"
            className="hover:text-secondary transition duration-300"
          >
            Map
          </Link>
          <Link
            to="/submissions"
            className="hover:text-secondary transition duration-300"
          >
            Report Sighting
          </Link>
          {isAdmin && (
            <Link
              to="/admin-portal"
              className="hover:text-secondary transition duration-300"
            >
              Admin Portal
            </Link>
          )}
          {token && userId && (
            <Link
              to={`/profile/${userId}`}
              className="hover:text-secondary transition duration-300"
            >
              My Profile
            </Link>
          )}
          {token ? (
            <button
              onClick={() => {
                logout();
                window.location.href = "/login";
              }}
              className="bg-secondary text-text-light px-4 py-2 rounded hover:bg-secondary-dark transition duration-300"
            >
              Logout
            </button>
          ) : (
            <>
              <Link
                to="/login"
                className="hover:text-secondary transition duration-300"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="hover:text-secondary transition duration-300"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden fixed inset-0 bg-main z-50 transition-transform duration-300 transform ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col p-4">
          <button
            onClick={handleMenuToggle}
            className="text-2xl self-end focus:outline-none"
          >
            &times;
          </button>
          <Link
            to="/"
            className="py-2 text-xl border-b border-gray-200 hover:text-secondary transition duration-300"
            onClick={handleMenuToggle}
          >
            Home
          </Link>
          <Link
            to="/about"
            className="py-2 text-xl border-b border-gray-200 hover:text-secondary transition duration-300"
            onClick={handleMenuToggle}
          >
            About
          </Link>
          <Link
            to="/map"
            className="py-2 text-xl border-b border-gray-200 hover:text-secondary transition duration-300"
            onClick={handleMenuToggle}
          >
            Map
          </Link>
          <Link
            to="/submissions"
            className="py-2 text-xl border-b border-gray-200 hover:text-secondary transition duration-300"
            onClick={handleMenuToggle}
          >
            Report Sighting
          </Link>
          {isAdmin && (
            <Link
              to="/admin-portal"
              className="py-2 text-xl border-b border-gray-200 hover:text-secondary transition duration-300"
              onClick={handleMenuToggle}
            >
              Admin Portal
            </Link>
          )}
          {token && userId && (
            <Link
              to={`/profile/${userId}`}
              className="py-2 text-xl border-b border-gray-200 hover:text-secondary transition duration-300"
              onClick={handleMenuToggle}
            >
              My Profile
            </Link>
          )}
          {token ? (
            <button
              onClick={() => {
                logout();
                window.location.href = "/login";
              }}
              className="bg-secondary text-text-light px-4 py-2 rounded mt-4 hover:bg-secondary-dark transition duration-300"
            >
              Logout
            </button>
          ) : (
            <>
              <Link
                to="/login"
                className="py-2 text-xl border-b border-gray-200 hover:text-secondary transition duration-300"
                onClick={handleMenuToggle}
              >
                Login
              </Link>
              <Link
                to="/register"
                className="py-2 text-xl border-b border-gray-200 hover:text-secondary transition duration-300"
                onClick={handleMenuToggle}
              >
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
