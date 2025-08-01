const StatsSection = () => {
  const stats = [
    { number: "2000+", label: "Drivers Hired" },
    { number: "1000+", label: "Active Jobs" },
    { number: "500+", label: "Partner Companies" },
    { number: "98%", label: "Success Rate" },
  ];

  return (
    <div className="py-24 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-r-[150px] mr-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                {stat.number}
              </div>
              <div className="text-primary-100 text-lg">
                {" "}
                <h2>{stat.label}</h2>{" "}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StatsSection;
