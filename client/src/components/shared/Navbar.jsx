import {
  Book,
  ChartArea,
  GitCompareArrows,
  HomeIcon,
  Wallet,
  LogOut,
  User,
  Car,
  Settings,
} from "lucide-react";
import { useState } from "react";
import { BiCar } from "react-icons/bi";
import { HiMenu, HiX } from "react-icons/hi";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store";
import { useProfile } from "../../hooks/useQueries";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuthStore();
  const { data: profile } = useProfile();

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    navigate("/");
  };

  const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ""}${
      lastName?.charAt(0) || ""
    }`.toUpperCase();
  };

  const currentUser = profile?.data || user;

  return (
    <nav className="bg-gradient-to-r from-green-600 to-green-700 backdrop-blur-md shadow-lg fixed w-full top-0 z-50 py-4 rounded-b-[50px]">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-xl font-black text-white">Shoferi.rw</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="text-white hover:text-green-200 transition-colors flex gap-2"
            >
              <HomeIcon />
              Home
            </Link>
            <Link
              to="/jobs"
              className="text-white hover:text-green-200 transition-colors flex gap-2 "
            >
              <Wallet />
              Jobs
            </Link>

            {isAuthenticated && (
              <>
                <Link
                  to="/feed"
                  className="text-white hover:text-green-200 transition-colors flex gap-2"
                >
                  <ChartArea />
                  Feed
                </Link>
                <Link
                  to="/learn"
                  className="text-white hover:text-green-200 transition-colors flex gap-2"
                >
                  <Book />
                  Learn
                </Link>

                {/* Show Dashboard links based on user type */}
                {currentUser?.accountType === "driver" && (
                  <Link
                    to="/driver-dashboard"
                    className="text-white hover:text-green-200 transition-colors flex gap-2"
                  >
                    <Car />
                    Dashboard
                  </Link>
                )}
                {currentUser?.accountType === "admin" && (
                  <Link
                    to="/admin-dashboard"
                    className="text-white hover:text-green-200 transition-colors flex gap-2"
                  >
                    <Settings />
                    Admin
                  </Link>
                )}
              </>
            )}

            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 text-white hover:text-green-200 transition-colors"
                >
                  <div className="w-8 h-8 bg-white text-green-600 rounded-full flex items-center justify-center font-semibold text-sm">
                    {currentUser?.profileUrl ? (
                      <img
                        src={currentUser.profileUrl}
                        alt="Profile"
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      getInitials(currentUser?.firstName, currentUser?.lastName)
                    )}
                  </div>
                  <span className="font-medium">{currentUser?.firstName}</span>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl py-2 z-10 border border-green-100">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="font-semibold text-gray-800">
                        {currentUser?.firstName} {currentUser?.lastName}
                      </p>
                      <p className="text-sm text-gray-600">
                        {currentUser?.email}
                      </p>
                      <p className="text-xs text-green-600 capitalize">
                        {currentUser?.accountType || "User"}
                      </p>
                    </div>
                    <Link
                      to="/settings"
                      className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-green-50 transition-colors"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <Settings className="w-4 h-4" />
                      Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-white hover:text-green-200 transition-colors font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-white text-green-600 font-semibold px-6 py-2 rounded-full hover:bg-green-50 transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-white">
              {isOpen ? (
                <HiX className="w-6 h-6" />
              ) : (
                <HiMenu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {isOpen && (
          <div className="md:hidden bg-white border-t rounded-b-lg shadow-lg">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                to="/"
                className="block px-3 py-2 text-gray-700 hover:bg-green-50 rounded-lg transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/jobs"
                className="block px-3 py-2 text-gray-700 hover:bg-green-50 rounded-lg transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Jobs
              </Link>

              {isAuthenticated ? (
                <>
                  <Link
                    to="/feed"
                    className="block px-3 py-2 text-gray-700 hover:bg-green-50 rounded-lg transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    Feed
                  </Link>
                  <Link
                    to="/learn"
                    className="block px-3 py-2 text-gray-700 hover:bg-green-50 rounded-lg transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    Learn
                  </Link>
                  {currentUser?.accountType === "driver" && (
                    <Link
                      to="/driver-dashboard"
                      className="block px-3 py-2 text-gray-700 hover:bg-green-50 rounded-lg transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      Driver Dashboard
                    </Link>
                  )}
                  <Link
                    to="/settings"
                    className="block px-3 py-2 text-gray-700 hover:bg-green-50 rounded-lg transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    Settings
                  </Link>
                  <div className="border-t pt-2 mt-2">
                    <div className="px-3 py-2">
                      <p className="font-semibold text-gray-800">
                        {currentUser?.firstName} {currentUser?.lastName}
                      </p>
                      <p className="text-sm text-gray-600">
                        {currentUser?.email}
                      </p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="block px-3 py-2 text-gray-700 hover:bg-green-50 rounded-lg transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="block w-full text-left px-3 py-2 bg-green-600 text-white rounded-lg mt-2 hover:bg-green-700 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
