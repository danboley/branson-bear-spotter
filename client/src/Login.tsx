import React, { useState } from "react";
import { useAuth } from "./AuthContext";
import axios from "axios";

const Login: React.FC = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<string[] | null>(null);

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
      console.log("Login successful");
      window.location.href = "/home";
    } catch (error: any) {
      setErrors(error.response.data.error);
      console.error("Error logging in:", error);
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
          className="bg-main text-text-light px-4 py-2 rounded hover:bg-secondary-dark transition duration-300"
        >
          Login
        </button>
      </form>
      {errors && errors.length > 0 ? (
        <div className="mt-4 text-red-500 bg-white rounded p-2">{errors}</div>
      ) : null}
      <div className="mt-4 text-center">
        <p className="text-text-light mb-2">New User?</p>
        <a href="/register">
          <button className="bg-secondary text-text-light px-4 py-2 rounded hover:bg-secondary-dark transition duration-300">
            Sign Up
          </button>
        </a>
      </div>
    </div>
  );
};

export default Login;
