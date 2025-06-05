import { useState } from "react";
import { BiCar } from "react-icons/bi";
import { HiMenu, HiX } from "react-icons/hi";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-purple-500 backdrop-blur-md shadow-sm fixed w-full top-0 z-50 py-5 rounded-b-[50px]">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <BiCar className="text-white text-lg font-bold" />
              </div>
              <span className="text-xl font-bold text-white">SHOFERI</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="text-white hover:text-indigo-200 transition-colors"
            >
              Home
            </Link>
            <Link
              to="/jobs"
              className="text-white hover:text-indigo-100 transition-colors"
            >
              Jobs
            </Link>
            <Link
              to="/login"
              className="text-white hover:text-indigo-100 transition-colors"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="text-white hover:text-indigo-100 transition-colors"
            >
              Register
            </Link>
            <Link 
              to="/register"
              className="bg-gradient-to-r border border-white text-white px-6 py-2 rounded-full hover:shadow-lg transition-all"
            >
              Get Started
            </Link>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white"
            >
              {isOpen ? (
                <HiX className="w-6 h-6" />
              ) : (
                <HiMenu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {isOpen && (
          <div className="md:hidden bg-white border-t">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link to="/" className="block px-3 py-2 text-gray-700">
                Home
              </Link>
              <Link to="/jobs" className="block px-3 py-2 text-gray-700">
                Jobs
              </Link>
              <Link to="/login" className="block px-3 py-2 text-gray-700">
                Login
              </Link>
              <Link to="/register" className="block px-3 py-2 text-gray-700">
                Register
              </Link>
              <Link 
                to="/register"
                className="block w-full text-left px-3 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-lg mt-2"
              >
                Get Started
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
