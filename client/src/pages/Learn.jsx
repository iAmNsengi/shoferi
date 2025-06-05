import { BiBookOpen, BiVideo, BiCheckCircle } from "react-icons/bi";
import DownloadApp from "../components/sections/DownloadApp";

const Learn = () => {
  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-indigo-700 via-purple-700 to-purple-900 text-white pt-40 pb-10">
        {/* Decorative Background */}
        <div className="absolute inset-0 opacity-10 z-0">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Start Learning Driving for Free
            </h2>
            <p className="text-purple-100 text-lg max-w-2xl mx-auto">
              Shoferi empowers everyone in Rwanda with free access to essential
              driving skills and road safety knowledge.
            </p>
          </div>

          {/* Learning Sections */}
          <div className="grid md:grid-cols-3 gap-8">
            {/* Section 1 */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-lg border border-white/10 hover:scale-105 transition-transform">
              <BiBookOpen className="text-4xl text-yellow-300 mb-4" />
              <h3 className="text-2xl font-semibold mb-2">Beginner Guides</h3>
              <p className="text-purple-100">
                Start with the basics: road rules, traffic signs, and vehicle
                controls.
              </p>
            </div>

            {/* Section 2 */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-lg border border-white/10 hover:scale-105 transition-transform">
              <BiVideo className="text-4xl text-orange-300 mb-4" />
              <h3 className="text-2xl font-semibold mb-2">Video Lessons</h3>
              <p className="text-purple-100">
                Watch easy-to-understand videos covering key driving scenarios
                and maneuvers.
              </p>
            </div>

            {/* Section 3 */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-lg border border-white/10 hover:scale-105 transition-transform">
              <BiCheckCircle className="text-4xl text-green-300 mb-4" />
              <h3 className="text-2xl font-semibold mb-2">
                Quizzes & Practice
              </h3>
              <p className="text-purple-100">
                Test your knowledge and practice for your driver’s license with
                interactive quizzes.
              </p>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center mt-20">
            <h3 className="text-3xl font-bold mb-4">Ready to get started?</h3>
            <p className="text-purple-100 mb-6">
              Begin your learning journey and become a confident, skilled driver
              with Shoferi.
            </p>
            <button className="bg-white text-purple-700 px-8 py-4 rounded-full font-semibold hover:shadow-xl transition-all hover:scale-105">
              Start Learning Now
            </button>
          </div>
        </div>
      </div>
      <DownloadApp />
    </>
  );
};

export default Learn;
