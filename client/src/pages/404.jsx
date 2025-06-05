import {
  BiHome,
  BiCar,
  BiMapPin,
  BiCompass,
  BiArrowToLeft,
} from "react-icons/bi";
import { BsArrowRight } from "react-icons/bs";

const NotFound = () => {
  return (
    <div className="relative min-h-screen bg-gradient-to-br  from-purple-600 via-purple-700 to-indigo-800 overflow-hidden flex items-center justify-center">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-24 left-10 w-72 h-72 bg-white rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-54 right-20 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/4 w-64 h-64 bg-white rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Road Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/3 left-0 w-full h-2 bg-white transform rotate-12"></div>
        <div className="absolute top-1/2 left-0 w-full h-1 bg-white transform -rotate-6"></div>
        <div className="absolute bottom-1/3 left-0 w-full h-2 bg-white transform rotate-3"></div>
      </div>

      <div className="relative container mx-auto px-4 text-center pt-40">
        {/* Animated Car Icon */}
        <div className="mb-8 relative">
          <div className="inline-flex items-center justify-center w-32 h-32 bg-white/10 backdrop-blur-lg rounded-full border border-white/20 shadow-2xl mb-6 animate-bounce">
            <BiCar className="text-6xl text-white" />
          </div>

          {/* Floating Icons */}
          <div className="absolute -top-4 -left-8 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center animate-ping">
            <BiMapPin className="text-white text-sm" />
          </div>
          <div className="absolute -top-2 -right-6 w-6 h-6 bg-orange-400 rounded-full flex items-center justify-center animate-pulse">
            <BiCompass className="text-white text-xs" />
          </div>
        </div>

        {/* 404 Display */}
        <div className="mb-8">
          <div className="text-8xl md:text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-orange-300 to-red-300 mb-4 animate-pulse">
            404
          </div>
          <div className="inline-flex items-center bg-white/20 backdrop-blur-sm rounded-full px-6 py-3 mb-6">
            <span className="text-white text-lg font-medium">
              🚗 ROUTE NOT FOUND
            </span>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-2xl mx-auto mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            Oops! You've Taken a
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300">
              Wrong Turn
            </span>
          </h1>

          <p className="text-xl text-purple-100 mb-8 leading-relaxed">
            Looks like this page has driven off the map! Don't worry, even the
            best drivers sometimes take a detour. Let's get you back on the
            right route.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <button className="bg-white text-purple-700 px-8 py-4 rounded-full font-semibold hover:shadow-xl transition-all hover:scale-105 flex items-center justify-center gap-2">
              <BiHome className="text-xl" />
              Go Home
            </button>
            <button className="flex items-center justify-center gap-2 bg-transparent border-2 border-white text-white px-8 py-4 rounded-full font-semibold hover:bg-white hover:text-purple-700 transition-all">
              <BiArrowToLeft className="text-xl" />
              Go Back
            </button>
          </div>

          {/* Helpful Links */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all cursor-pointer group">
              <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <BiCar className="text-white text-xl" />
              </div>
              <h3 className="text-white font-semibold mb-2">Find Jobs</h3>
              <p className="text-purple-100 text-sm">
                Browse available driving opportunities
              </p>
              <div className="flex items-center text-yellow-300 text-sm mt-3 group-hover:gap-2 transition-all">
                <span>Explore</span>
                <BsArrowRight className="ml-1 group-hover:ml-0 transition-all" />
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all cursor-pointer group">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <BiCompass className="text-white text-xl" />
              </div>
              <h3 className="text-white font-semibold mb-2">Community</h3>
              <p className="text-purple-100 text-sm">
                Connect with fellow drivers
              </p>
              <div className="flex items-center text-yellow-300 text-sm mt-3 group-hover:gap-2 transition-all">
                <span>Join</span>
                <BsArrowRight className="ml-1 group-hover:ml-0 transition-all" />
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all cursor-pointer group">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <BiMapPin className="text-white text-xl" />
              </div>
              <h3 className="text-white font-semibold mb-2">Support</h3>
              <p className="text-purple-100 text-sm">Get help and guidance</p>
              <div className="flex items-center text-yellow-300 text-sm mt-3 group-hover:gap-2 transition-all">
                <span>Contact</span>
                <BsArrowRight className="ml-1 group-hover:ml-0 transition-all" />
              </div>
            </div>
          </div>
        </div>

        {/* Fun Stats */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 max-w-lg mx-auto">
          <h4 className="text-white font-semibold mb-4">
            While you're here...
          </h4>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-yellow-300 mb-1">
                1,247
              </div>
              <div className="text-purple-100 text-sm">Drivers Online</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-300 mb-1">89</div>
              <div className="text-purple-100 text-sm">Jobs Posted Today</div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mt-8 max-w-md mx-auto">
          <div className="bg-white/10 backdrop-blur-lg rounded-full p-2 border border-white/20">
            <div className="flex items-center">
              <input
                type="text"
                placeholder="Search for something specific..."
                className="flex-1 bg-transparent text-white placeholder-purple-200 px-4 py-2 outline-none"
              />
              <button className="bg-gradient-to-r from-yellow-400 to-orange-400 text-purple-800 px-6 py-2 rounded-full font-semibold hover:shadow-lg transition-all">
                Search
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Road Signs */}
      <div className="absolute top-8 left-8 hidden lg:block">
        <div className="bg-yellow-400 text-purple-800 px-4 py-2 rounded-lg font-bold text-sm transform -rotate-12 shadow-lg">
          DETOUR
        </div>
      </div>
      <div className="absolute top-12 right-12 hidden lg:block">
        <div className="bg-red-500 text-white px-4 py-2 rounded-lg font-bold text-sm transform rotate-6 shadow-lg">
          DEAD END
        </div>
      </div>
      <div className="absolute bottom-8 left-1/4 hidden lg:block">
        <div className="bg-green-500 text-white px-4 py-2 rounded-lg font-bold text-sm transform -rotate-6 shadow-lg">
          HOME ← 1KM
        </div>
      </div>
    </div>
  );
};

export default NotFound;
