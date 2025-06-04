import { useState } from "react";
import { BiCar } from "react-icons/bi";
import { HiMenu, HiX } from "react-icons/hi";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white/90 backdrop-blur-md shadow-sm fixed w-full top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <BiCar className="text-white text-lg font-bold" />
              </div>
              <span className="text-xl font-bold text-gray-900">SHOFERI</span>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <a
              href="#home"
              className="text-gray-700 hover:text-purple-600 transition-colors"
            >
              Home
            </a>
            <a
              href="#features"
              className="text-gray-700 hover:text-purple-600 transition-colors"
            >
              Features
            </a>
            <a
              href="#jobs"
              className="text-gray-700 hover:text-purple-600 transition-colors"
            >
              Jobs
            </a>
            <a
              href="#about"
              className="text-gray-700 hover:text-purple-600 transition-colors"
            >
              About
            </a>
            <a
              href="#contact"
              className="text-gray-700 hover:text-purple-600 transition-colors"
            >
              Contact
            </a>
            <button className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-6 py-2 rounded-full hover:shadow-lg transition-all">
              Get Started
            </button>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700"
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
              <a href="#home" className="block px-3 py-2 text-gray-700">
                Home
              </a>
              <a href="#features" className="block px-3 py-2 text-gray-700">
                Features
              </a>
              <a href="#jobs" className="block px-3 py-2 text-gray-700">
                Jobs
              </a>
              <a href="#about" className="block px-3 py-2 text-gray-700">
                About
              </a>
              <a href="#contact" className="block px-3 py-2 text-gray-700">
                Contact
              </a>
              <button className="block w-full text-left px-3 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-lg mt-2">
                Get Started
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
