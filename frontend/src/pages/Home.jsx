import React from "react";
import Layout from "../components/Layout";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const Home = () => {
  const user = useSelector((state) => state.auth.user);

  return (
    <Layout>
      <div className="flex flex-col items-center justify-start md:justify-center h-screen bg-gradient-to-b from-blue-500 to-yellow-400 text-white p-4">
        <div className="text-center max-w-3xl w-full p-6 bg-white bg-opacity-10 backdrop-blur-lg rounded-lg shadow-xl mt-10 md:mt-0">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 drop-shadow-lg">
            Welcome to Your Cloud Drive
          </h1>
          <p className="text-lg md:text-xl font-light mb-6">
            Store, manage, and access your files securely from anywhere with
            ease and efficiency.
          </p>
          {user ? (
            <Link
              to="/files"
              className="px-6 py-3 md:px-8 md:py-3 bg-white text-blue-600 font-semibold rounded-lg shadow-lg hover:bg-blue-100 transition transform hover:scale-105"
            >
              Get Started
            </Link>
          ) : (
            <Link
              to="/login"
              className="px-6 py-3 md:px-8 md:py-3 bg-white text-blue-600 font-semibold rounded-lg shadow-lg hover:bg-blue-100 transition transform hover:scale-105"
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
