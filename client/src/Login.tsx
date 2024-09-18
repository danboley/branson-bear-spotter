import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Handle login
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:5005/api/auth/login",
        { email, password }
      );
      const { token, user } = response.data;
      login({ token, userId: user.id, isAdmin: user.isAdmin });
      navigate("/home");
    } catch (error: any) {
      toast.error(error.response.data.error);
    }
  };

  return (
    <div className="p-4 bg-main min-h-screen flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-4 text-text-light">Login</h2>
      <form
        className="w-full max-w-md bg-white p-6 rounded-lg shadow-md"
        onSubmit={handleSubmit}
      >
        <div className="mb-4">
          <label className="block text-lg font-semibold mb-2">Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-lg font-semibold mb-2">Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <button
          type="submit"
          className="bg-main text-text-light px-4 py-2 rounded hover:bg-secondary transition duration-300"
        >
          Login
        </button>
      </form>
      <div className="mt-4 text-center">
        <p className="text-text-light mb-2">New User?</p>
        <a href="/register">
          <button className="bg-secondary border-2 border-white hover:bg-main text-text-light px-4 py-2 rounded hover:bg-secondary-dark transition duration-300">
            Sign Up
          </button>
        </a>
      </div>
    </div>
  );
};

export default Login;
