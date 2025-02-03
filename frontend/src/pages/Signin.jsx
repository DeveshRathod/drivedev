import React, { useState } from "react";
import Layout from "../components/Layout";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../store/reducers/user.slice";
import axios from "axios";

const Signin = () => {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [credentials, setCredentials] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/v1/user/signin", credentials);
      dispatch(setUser(response.data.user));
      localStorage.setItem("token", response.data.token);
      navigate("/");
    } catch (error) {
      console.error(
        "Signin failed:",
        error.response?.data?.message || error.message
      );
    }
  };

  return (
    <Layout>
      <div className="flex items-start justify-center min-h-[calc(100vh-70px)] p-4 pt-10">
        <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg mt-4 md:mt-0">
          <h2 className="text-3xl font-extrabold text-center text-blue-600 mb-6">
            Welcome Back!
          </h2>
          <p className="text-gray-600 text-center mb-6">
            Sign in to your account to continue.
          </p>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={credentials.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={credentials.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-200 font-semibold"
            >
              Sign In
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-4">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-blue-500 font-medium hover:underline"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default Signin;
