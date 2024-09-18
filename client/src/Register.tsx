import React, { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "./AuthContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Register: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    firstName: "",
    lastName: "",
    location: "",
    imagePath: null as File | null,
    password: "",
    confirmPassword: "",
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle image file change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData({
        ...formData,
        imagePath: file,
      });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Handle registration
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    const data = new FormData();
    data.append("username", formData.username);
    data.append("email", formData.email);
    data.append("firstName", formData.firstName);
    data.append("lastName", formData.lastName);
    data.append("location", formData.location);
    data.append("isAdmin", "false");
    if (formData.imagePath) {
      data.append("imagePath", formData.imagePath);
    }
    data.append("password", formData.password);

    try {
      // Register
      await axios.post("http://localhost:5005/api/auth/register", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
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
      toast.success("Registration successful!");
      navigate("/home");
    } catch (error: any) {
      toast.error(error.response.data.error);
    }
  };

  return (
    <div className="p-4 bg-main min-h-screen flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-4 text-text-light">Register</h2>
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg bg-white p-6 rounded-lg shadow-md"
        encType="multipart/form-data"
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
            type="file"
            name="imagePath"
            onChange={handleFileChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
          {imagePreview && (
            <div className="mt-4">
              <img
                src={imagePreview}
                alt="Image preview"
                className="w-full h-auto border border-gray-300 rounded"
              />
            </div>
          )}
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
          className="bg-main text-text-light px-4 py-2 rounded hover:bg-secondary transition duration-300"
        >
          Register
        </button>
      </form>
      <div className="mt-4 text-center">
        <p className="text-text-light mb-2">Already a Member?</p>
        <a href="/login">
          <button className="bg-secondary border-2 border-white hover:bg-main text-text-light px-4 py-2 rounded hover:bg-secondary-dark transition duration-300">
            Log In
          </button>
        </a>
      </div>
    </div>
  );
};

export default Register;
