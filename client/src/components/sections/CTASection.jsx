const CTASection = () => {
  return (
    <div className="py-20 bg-green-600 relative">
      <div className="relative container mx-auto px-4 text-center">
        <h2 className="text-4xl md:text-5xl text-white font-bold mb-6">
          Ready to Start Your Journey?
        </h2>
        <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
          Join thousands of drivers and companies who are already part of the
          Shoferi community
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-secondary-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-primary-700 transition-colors">
            Find Your Next Job
          </button>
          <button className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-gray-800 transition-colors">
            Hire Professional Drivers
          </button>
        </div>
      </div>
    </div>
  );
};

export default CTASection;
