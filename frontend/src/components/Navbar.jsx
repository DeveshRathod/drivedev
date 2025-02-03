import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { removeUser } from "../store/reducers/user.slice";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  return (
    <nav className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center fixed top-0 left-0 w-full z-50 shadow-lg backdrop-blur-md h-16">
      <div className="text-2xl font-bold">Drive</div>

      <div className="md:hidden">
        <button onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? (
            <span className="text-2xl">&times;</span>
          ) : (
            <span className="text-2xl">&#9776;</span>
          )}
        </button>
      </div>

      <div
        className={`md:flex md:space-x-6 absolute md:static top-16 left-0 w-full md:w-auto bg-blue-600 md:bg-transparent text-center md:text-left transition-all duration-300 z-50 shadow-lg md:shadow-none ${
          isOpen ? "block h-fit w-full" : "hidden"
        }`}
      >
        <NavLink
          to="/"
          className={({ isActive }) =>
            `block py-2 md:inline ${
              isActive ? "underline font-semibold" : ""
            } hover:underline`
          }
          onClick={() => setIsOpen(false)}
        >
          Home
        </NavLink>

        {user && (
          <NavLink
            to="/files"
            className={({ isActive }) =>
              `block py-2 md:inline ${
                isActive ? "underline font-semibold" : ""
              } hover:underline`
            }
            onClick={() => setIsOpen(false)}
          >
            Files
          </NavLink>
        )}

        {user ? (
          <button
            className="text-white p-2 bg-red-500 rounded-md mb-2 sm:mb-0"
            onClick={() => {
              dispatch(removeUser());
              navigate("/");
            }}
          >
            Logout
          </button>
        ) : (
          <NavLink
            to="/login"
            className={({ isActive }) =>
              `block py-2 md:inline ${
                isActive ? "underline font-semibold" : ""
              } hover:underline`
            }
            onClick={() => setIsOpen(false)}
          >
            Login
          </NavLink>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
