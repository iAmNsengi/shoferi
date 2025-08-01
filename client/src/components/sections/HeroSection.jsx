import { BiCar, BiPlay } from "react-icons/bi";

const HeroSection = () => {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-green-50 via-green-100 to-green-200 overflow-hidden pt-16">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-400/10 to-green-600/10"></div>
      <div className="absolute top-20 left-10 w-72 h-72 bg-green-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
      <div className="absolute top-40 right-10 w-72 h-72 bg-green-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-green-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>

      <div className="relative container mx-auto px-4 py-20">
        <div className="flex flex-col lg:flex-row items-center min-h-[80vh]">
          {/* Left Content */}
          <div className="lg:w-1/2 text-center lg:text-left mb-12 lg:mb-0">
            <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium mb-6">
              <BiCar className="mr-2 text-green-600" />
              Connecting Drivers with Opportunities
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              With Shoferi Drivers,
              <br />
              <span className="text-green-600 bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">
                Everything Is Easier
              </span>
            </h1>

            <p className="text-xl text-gray-700 mb-8 leading-relaxed max-w-lg mx-auto lg:mx-0">
              Shoferi is the premier platform designed for connecting skilled
              drivers with top companies across Rwanda. Find your perfect
              driving opportunity today.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                Find Driving Jobs
              </button>
              <button className="flex items-center justify-center gap-2 bg-white border-2 border-green-200 text-gray-700 px-8 py-4 rounded-xl font-semibold hover:bg-green-50 hover:border-green-300 transition-all duration-300 transform hover:scale-105 shadow-lg">
                <BiPlay className="text-xl text-green-600" />
                What's Shoferi?
              </button>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-8 mt-12 justify-center lg:justify-start">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">500+</div>
                <div className="text-sm text-gray-600">Active Drivers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">100+</div>
                <div className="text-sm text-gray-600">Partner Companies</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">1000+</div>
                <div className="text-sm text-gray-600">Jobs Posted</div>
              </div>
            </div>
          </div>

          {/* Right Content - Hero Image/Card */}
          <div className="lg:w-1/2 relative">
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl p-8 transform rotate-3 hover:rotate-0 transition-transform duration-300">
                <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white mb-6">
                  <h3 className="text-xl font-semibold mb-2">Featured Job</h3>
                  <p className="text-green-100">Professional Driver Needed</p>
                  <div className="flex items-center mt-4">
                    <div className="bg-white/20 rounded-full p-2 mr-3">
                      <BiCar className="text-white text-xl" />
                    </div>
                    <div>
                      <p className="font-medium">Kigali Transport Co.</p>
                      <p className="text-sm text-green-100">
                        RWF 500,000/month
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">Experience Level</span>
                    <span className="font-semibold text-green-600">
                      3+ Years
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">Location</span>
                    <span className="font-semibold text-green-600">Kigali</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">Job Type</span>
                    <span className="font-semibold text-green-600">
                      Full-time
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
