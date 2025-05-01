import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { AiOutlineClose } from "react-icons/ai";
import { HiMenuAlt3 } from "react-icons/hi";
import { Link, useNavigate, useLocation } from "react-router-dom";
import CustomButton from "./CustomButton";
import MenuList from "./MenuList";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const auth = JSON.parse(localStorage.getItem("userInfo"));
  const [isOpen, setIsOpen] = useState(false);
  const [LoggedIn, setLoggedIn] = useState(null);

  useEffect(() => {
    if (auth) {
      setLoggedIn(auth);
    } else {
      setLoggedIn(null);
    }
  }, [auth?.token, auth?.user?.accountType]);

  const user = LoggedIn;
  const isDriver = user?.user?.accountType === "driver";

  const handleCloseNavbar = () => {
    setIsOpen(false);
  };

  const navLinks = [
    {
      name: isDriver ? "My Profile" : "Find Jobs",
      path: isDriver ? "/driver-profile" : "/find-jobs",
      show: true,
    },
    {
      name: "Find Drivers",
      path: "/find-drivers",
      show: !isDriver,
    },
    {
      name: "Companies",
      path: "/companies",
      show: !isDriver,
    },
    {
      name: "Upload Job",
      path: "/upload-job",
      show: user?.user?.accountType === "company",
    },
    {
      name: "About",
      path: "/about-us",
      show: true,
    },
  ].filter((link) => link.show);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 bg-white shadow-md z-50"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-2 rounded-lg">
              <span className="text-white font-bold text-xl">shoferi</span>
              <span className="text-orange-400 font-bold text-xl">.com</span>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <ul className="flex space-x-8">
              {navLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                      location.pathname === link.path
                        ? "text-blue-600"
                        : "text-gray-700"
                    }`}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="flex items-center space-x-4">
              {!user?.token ? (
                <Link to="/user-auth">
                  <CustomButton
                    title="Sign In"
                    containerStyles="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-colors"
                  />
                </Link>
              ) : (
                <MenuList user={user?.user} />
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <AiOutlineClose size={24} /> : <HiMenuAlt3 size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-white border-t"
        >
          <div className="container mx-auto px-4 py-4 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={handleCloseNavbar}
                className={`block py-2 text-sm font-medium transition-colors hover:text-blue-600 ${
                  location.pathname === link.path
                    ? "text-blue-600"
                    : "text-gray-700"
                }`}
              >
                {link.name}
              </Link>
            ))}

            {!user?.token && (
              <Link
                to="/user-auth"
                onClick={handleCloseNavbar}
                className="block mt-4"
              >
                <CustomButton
                  title="Sign In"
                  containerStyles="w-full bg-blue-600 text-white py-2 rounded-full hover:bg-blue-700 transition-colors text-center"
                />
              </Link>
            )}
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
};

export default Navbar;
