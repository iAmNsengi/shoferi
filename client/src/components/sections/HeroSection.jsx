import { BiCar, BiPlay } from "react-icons/bi";

const HeroSection = () => {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-green-50 via-green-100 to-green-200 overflow-hidden pt-16">
      {/* Blurred background image */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1)), linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(22, 163, 74, 0.1)), url('https://plus.unsplash.com/premium_photo-1661308330687-f50174a3ca60?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nzd8fGElMjBoYXBweSUyMG1hbiUyMHdpdGglMjB0aHVtYnMlMjB1cHxlbnwwfDB8MHx8fDA%3D')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
          filter: "blur(2px)",
        }}
      ></div>
      {/* Enhanced green overlays */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 via-green-600/15 to-green-700/10"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-green-400/25 via-transparent to-green-500/20"></div>

      {/* Animated green blobs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-green-400 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
      <div className="absolute top-40 right-10 w-72 h-72 bg-green-500 rounded-full mix-blend-multiply filter blur-xl opacity-25 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-green-600 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>

      {/* Additional green accent elements */}
      <div className="absolute top-1/4 right-1/4 w-48 h-48 bg-green-300 rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/3 w-32 h-32 bg-green-400 rounded-full mix-blend-multiply filter blur-xl opacity-25 animate-bounce"></div>

      {/* Green gradient overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-green-900/10 via-transparent to-green-800/15"></div>

      <div className="relative container mx-auto px-4 py-20">
        <div className="flex flex-col lg:flex-row items-center min-h-[80vh]">
          {/* Left Content */}
          <div className="lg:w-1/2 text-center lg:text-left mb-12 lg:mb-0">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              With Shoferi Drivers,
              <br />
              <span className="text-green-400 bg-gradient-to-r from-green-400 to-green-300 bg-clip-text text-transparent">
                Everything Is Easier
              </span>
            </h1>

            <p className="text-xl text-white mb-8 leading-relaxed max-w-lg mx-auto lg:mx-0">
              Shoferi is the premier platform designed for connecting skilled
              drivers with top companies across Rwanda. Find your perfect
              driving opportunity today.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                Find Driving Jobs
              </button>
              <button className="flex items-center justify-center gap-2 bg-white/90 backdrop-blur-sm border-2 border-green-200 text-gray-700 px-8 py-4 rounded-xl font-semibold hover:bg-green-50 hover:border-green-300 transition-all duration-300 transform hover:scale-105 shadow-lg">
                <BiPlay className="text-xl text-green-600" />
                What's Shoferi?
              </button>
            </div>
          </div>

          {/* Right Content */}
          <div className="lg:w-1/2 relative"></div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
