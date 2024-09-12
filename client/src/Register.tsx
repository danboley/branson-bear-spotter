import React, { useState, FormEvent } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";

const Register: React.FC = () => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    firstName: "",
    lastName: "",
    location: "",
    profilePicture: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<string[] | null>(null);

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle registration
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      // Register
      await axios.post("http://localhost:5005/api/auth/register", {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        location: formData.location,
        profilePicture: formData.profilePicture,
        isAdmin: false,
      });

      // Login
      const loginResponse = await axios.post(
        "http://localhost:5005/api/auth/login",
        {
          email: formData.email,
          password: formData.password,
        }
      );

      const { token, user } = loginResponse.data;
      login({ token, userId: user.id, isAdmin: user.isAdmin });
      window.location.href = "/home";
    } catch (error: any) {
      setErrors(error.response.data.error);
      console.error("Error registering user:", error);
    }
  };

  return (
    <div className="p-4 bg-main min-h-screen flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-4 text-text-light">Register</h2>
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg bg-white p-6 rounded-lg shadow-md"
      >
        <div className="mb-4">
          <label className="block text-lg font-semibold mb-2">Username</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-lg font-semibold mb-2">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-lg font-semibold mb-2">First Name</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-lg font-semibold mb-2">Last Name</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-lg font-semibold mb-2">Location</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-lg font-semibold mb-2">
            Profile Picture
          </label>
          <input
            type="text"
            name="profilePicture"
            value={formData.profilePicture}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-lg font-semibold mb-2">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-lg font-semibold mb-2">
            Confirm Password
          </label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <button
          type="submit"
          className="bg-main text-text-light px-4 py-2 rounded hover:bg-secondary-dark transition duration-300"
        >
          Register
        </button>
      </form>
      {errors && errors.length > 0 ? (
        <div className="mt-4 text-red-500 bg-white rounded p-2">{errors}</div>
      ) : null}
      <div className="mt-4 text-center">
        <p className="text-text-light mb-2">Already a Member?</p>
        <a href="/login">
          <button className="bg-secondary text-text-light px-4 py-2 rounded hover:bg-secondary-dark transition duration-300">
            Log In
          </button>
        </a>
      </div>
    </div>
  );
};

export default Register;
