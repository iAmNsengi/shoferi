const CTASection = () => {
  return (
    <div className="py-20 bg-gradient-to-br from-gray-800 via-gray-900 to-indigo-900 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
      </div>

      <div className="relative container mx-auto px-4 text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
          Ready to Start Your Journey?
        </h2>
        <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
          Join thousands of drivers and companies who are already part of the
          Shoferi community
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-white text-purple-700 px-8 py-4 rounded-full font-semibold hover:shadow-xl transition-all hover:scale-105">
            Find Your Next Job
          </button>
          <button className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-full font-semibold hover:bg-white hover:text-purple-700 transition-all">
            Hire Professional Drivers
          </button>
        </div>
      </div>
    </div>
  );
};

export default CTASection;
