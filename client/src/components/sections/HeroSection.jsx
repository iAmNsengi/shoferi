import { BsArrowRight } from "react-icons/bs";
import { BiCar, BiPlay } from "react-icons/bi";

const HeroSection = () => {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 overflow-hidden pt-16">
      {/* Decorative Elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-200 rounded-full blur-3xl"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-blue-200 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-1/4 w-64 h-64 bg-indigo-200 rounded-full blur-3xl"></div>
      </div>

      <div className="relative container mx-auto px-4 py-20">
        <div className="flex flex-col lg:flex-row items-center min-h-[80vh]">
          {/* Left Content */}
          <div className="lg:w-1/2 text-center lg:text-left mb-12 lg:mb-0">
            <div className="inline-flex items-center bg-purple-100 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
              <span className="text-purple-700 text-sm font-medium">
                🚗 DRIVING OPPORTUNITIES
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6 leading-tight">
              With Shoferi Drivers,
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">
                Everything Is Easier
              </span>
            </h1>

            <p className="text-xl text-gray-600 mb-8 leading-relaxed max-w-lg mx-auto lg:mx-0">
              Shoferi is the top platform designed for connecting skilled
              drivers with top companies across Rwanda. Find your perfect
              driving opportunity today.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button className="bg-purple-600 text-white px-8 py-4 rounded-full font-semibold hover:bg-purple-700 hover:shadow-xl transition-all hover:scale-105">
                Find Driving Jobs
              </button>
              <button className="flex items-center justify-center gap-2 bg-transparent border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-full font-semibold hover:bg-gray-100 hover:border-gray-400 transition-all">
                <BiPlay className="text-xl" />
                What's Shoferi?
              </button>
            </div>
          </div>

          {/* Right Content - Hero Image/Card */}
          <div className="lg:w-1/2 relative">
            <div className="relative bg-white/80 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-gray-200">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-50/30 to-transparent rounded-3xl"></div>
              <div className="relative">
                <div className="w-full h-80 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl mb-6 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-black/10"></div>
                  <div className="relative text-center text-white">
                    <BiCar className="text-6xl mx-auto mb-4" />
                    <h3 className="text-xl font-semibold">
                      Professional Drivers
                    </h3>
                    <p className="text-sm opacity-90">
                      Connecting talent with opportunity
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 backdrop-blur-sm rounded-xl p-4 text-center border border-gray-200">
                    <div className="text-2xl font-bold text-gray-800 mb-1">
                      1000+
                    </div>
                    <div className="text-gray-600 text-sm">
                      <h2>Active Jobs</h2>{" "}
                    </div>
                  </div>
                  <div className="bg-gray-50 backdrop-blur-sm rounded-xl p-4 text-center border border-gray-200">
                    <div className="text-2xl font-bold text-gray-800 mb-1">
                      500+
                    </div>
                    <div className="text-gray-600 text-sm">
                      <h2>Companies</h2>{" "}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <div className="absolute left-8 top-1/2 transform -translate-y-1/2 hidden lg:block">
        <button className="w-12 h-12 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-600 hover:bg-white shadow-lg transition-all">
          <BsArrowRight className="rotate-180" />
        </button>
      </div>
      <div className="absolute right-8 top-1/2 transform -translate-y-1/2 hidden lg:block">
        <button className="w-12 h-12 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-600 hover:bg-white shadow-lg transition-all">
          <BsArrowRight />
        </button>
      </div>
    </div>
  );
};

export default HeroSection;
