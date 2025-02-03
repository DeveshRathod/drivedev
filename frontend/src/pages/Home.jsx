import React from "react";
import Layout from "../components/Layout";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const Home = () => {
  const user = useSelector((state) => state.auth.user);

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)] bg-gradient-to-b from-blue-500 to-yellow-400 text-white">
        <div className="text-center max-w-3xl p-8 bg-white bg-opacity-10 backdrop-blur-lg rounded-lg shadow-xl">
          <h1 className="text-5xl font-extrabold mb-4 drop-shadow-lg">
            Welcome to Your Cloud Drive
          </h1>
          <p className="text-xl font-light mb-6">
            Store, manage, and access your files securely from anywhere with
            ease and efficiency.
          </p>
          {user ? (
            <Link
              to="/files"
              className="px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg shadow-lg hover:bg-blue-100 transition transform hover:scale-105"
            >
              Get Started
            </Link>
          ) : (
            <Link
              to="/login"
              className="px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg shadow-lg hover:bg-blue-100 transition transform hover:scale-105"
            >
              Join Us
            </Link>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Home;
