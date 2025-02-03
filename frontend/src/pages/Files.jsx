import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import axios from "axios";
import Card from "../components/Card";
import { FaSearch, FaPlus } from "react-icons/fa";
import emptyFolder from "../resources/empty.png";
import Loader from "../components/Loader";
import AddPopup from "../components/AddPopUp";

const Files = () => {
  const [files, setFiles] = useState([]);
  const [folders, setFolders] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");

    try {
      const response = await Promise.all([
        axios.get("http://localhost:3000/api/v1/data/homepage", {
          headers: { authorization: `${token}` },
        }),
        new Promise((resolve) => setTimeout(resolve, 1000)),
      ]);

      setFiles(response[0].data.data.files);
      setFolders(response[0].data.data.folders);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchSearchResults = async () => {
      const token = localStorage.getItem("token");

      if (searchQuery) {
        setLoading(true);
        try {
          const response = await Promise.all([
            axios.post(
              "http://localhost:3000/api/v1/data/search",
              { searchQuery },
              { headers: { authorization: `${token}` } }
            ),
            new Promise((resolve) => setTimeout(resolve, 1000)),
          ]);

          setFiles(response[0].data.data.files);
          setFolders(response[0].data.data.folders);
        } catch (error) {
          console.error("Error fetching search results:", error);
        } finally {
          setLoading(false);
        }
      } else {
        fetchData();
      }
    };

    fetchSearchResults();
  }, [searchQuery]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Layout>
      <div className="pt-8 mb-4 px-4 flex justify-center">
        <div className="relative w-full max-w-md mx-auto flex items-center space-x-2">
          <div className="relative w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search files or folders"
              className="w-full p-3 pl-10 pr-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 ease-in-out"
            />
            <div className="absolute top-3 left-3 text-gray-500">
              <FaSearch />
            </div>
          </div>
          <button
            className="p-3 bg-blue-500 text-white rounded-xl flex items-center justify-center hover:bg-blue-600 transition duration-300"
            onClick={() => {
              setOpenAdd(true);
            }}
          >
            <FaPlus />
          </button>
          <AddPopup
            open={openAdd}
            onClose={() => setOpenAdd(false)}
            refreshData={fetchData}
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-[calc(100vh-200px)]">
          <Loader />
        </div>
      ) : files.length === 0 && folders.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)] px-4 text-center">
          <img
            src={emptyFolder}
            alt="No data"
            className="w-32 h-32 md:w-48 md:h-48 mb-4"
          />
          <p className="text-base md:text-lg text-gray-500">
            No files or folders found. Use the <strong>Add</strong> button to
            create new content.
          </p>
        </div>
      ) : (
        <Card folders={folders} files={files} refreshData={fetchData} />
      )}
    </Layout>
  );
};

export default Files;
