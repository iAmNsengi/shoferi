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
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../../store/slices/authSlice";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logoutUser());
    localStorage.removeItem("shoferi_token");
    localStorage.removeItem("shoferi_user");
    setShowUserMenu(false);
    navigate("/");
  };

  const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ""}${lastName?.charAt(0) || ""}`.toUpperCase();
  };

  return (
    <nav className="bg-purple-500 backdrop-blur-md shadow-sm fixed w-full top-0 z-50 py-4 rounded-b-[50px]">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <BiCar className="text-white text-lg font-bold" />
              </div>
              <span className="text-xl font-black text-white">Shoferi</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="text-white hover:text-indigo-200 transition-colors flex gap-2"
            >
              <HomeIcon />
              Home
            </Link>
            <Link
              to="/jobs"
              className="text-white hover:text-indigo-100 transition-colors flex gap-2 "
            >
              <Wallet />
              Jobs
            </Link>
            
            {isAuthenticated && (
              <>
                <Link
                  to="/feed"
                  className="text-white hover:text-indigo-100 transition-colors flex gap-2"
                >
                  <ChartArea />
                  Feed
                </Link>
                <Link
                  to="/learn"
                  className="text-white hover:text-indigo-100 transition-colors flex gap-2"
                >
                  <Book />
                  Learn
                </Link>
                
                {/* Show Driver Dashboard link only for drivers */}
                {user?.accountType === "driver" && (
                  <Link
                    to="/driver-dashboard"
                    className="text-white hover:text-indigo-100 transition-colors flex gap-2"
                  >
                    <Car />
                    Dashboard
                  </Link>
                )}
              </>
            )}

            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 text-white hover:text-indigo-100 transition-colors"
                >
                  <div className="w-8 h-8 bg-white text-purple-600 rounded-full flex items-center justify-center font-semibold text-sm">
                    {user?.profileUrl ? (
                      <img
                        src={user.profileUrl}
                        alt="Profile"
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      getInitials(user?.firstName, user?.lastName)
                    )}
                  </div>
                  <span className="font-medium">{user?.firstName}</span>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-10">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="font-semibold text-gray-800">
                        {user?.firstName} {user?.lastName}
                      </p>
                      <p className="text-sm text-gray-600">{user?.email}</p>
                      <p className="text-xs text-purple-600 capitalize">
                        {user?.accountType || "User"}
                      </p>
                    </div>
                    <Link
                      to="/settings"
                      className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
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
                  className="text-white hover:text-indigo-100 transition-colors font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-gradient-to-r font-black border border-black border-r-[6px] text-white px-6 py-2 rounded-full hover:shadow-lg transition-all "
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
          <div className="md:hidden bg-white border-t rounded-b-lg">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link 
                to="/" 
                className="block px-3 py-2 text-gray-700"
                onClick={() => setIsOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/jobs" 
                className="block px-3 py-2 text-gray-700"
                onClick={() => setIsOpen(false)}
              >
                Jobs
              </Link>
              
              {isAuthenticated ? (
                <>
                  <Link 
                    to="/feed" 
                    className="block px-3 py-2 text-gray-700"
                    onClick={() => setIsOpen(false)}
                  >
                    Feed
                  </Link>
                  <Link 
                    to="/learn" 
                    className="block px-3 py-2 text-gray-700"
                    onClick={() => setIsOpen(false)}
                  >
                    Learn
                  </Link>
                  {user?.accountType === "driver" && (
                    <Link 
                      to="/driver-dashboard" 
                      className="block px-3 py-2 text-gray-700"
                      onClick={() => setIsOpen(false)}
                    >
                      Driver Dashboard
                    </Link>
                  )}
                  <Link 
                    to="/settings" 
                    className="block px-3 py-2 text-gray-700"
                    onClick={() => setIsOpen(false)}
                  >
                    Settings
                  </Link>
                  <div className="border-t pt-2 mt-2">
                    <div className="px-3 py-2">
                      <p className="font-semibold text-gray-800">
                        {user?.firstName} {user?.lastName}
                      </p>
                      <p className="text-sm text-gray-600">{user?.email}</p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-3 py-2 text-red-600"
                    >
                      Logout
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <Link 
                    to="/login" 
                    className="block px-3 py-2 text-gray-700"
                    onClick={() => setIsOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="block w-full text-left px-3 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-lg mt-2"
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
