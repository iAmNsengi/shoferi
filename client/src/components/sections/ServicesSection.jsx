import { Car, Building2, User } from "lucide-react";

const ServicesSection = () => {
  const services = [
    {
      icon: Car,
      title: "Driver Jobs",
      description:
        "Find verified driving opportunities with top companies across Rwanda. From delivery services to corporate transportation.",
      gradient: "from-primary-600 to-primary-500",
      accentColor: "primary-500",
    },
    {
      icon: Building2,
      title: "Company Hiring",
      description:
        "Connect with qualified, verified drivers for your business needs. Streamlined hiring process with background checks.",
      gradient: "from-secondary-600 to-secondary-500",
      accentColor: "secondary-500",
    },
    {
      icon: User,
      title: "Driver Training",
      description:
        "Professional development programs to enhance driving skills, safety awareness, and career advancement opportunities.",
      gradient: "from-accent-600 to-accent-500",
      accentColor: "accent-500",
    },
  ];

  return (
    <div className="py-24 bg-gradient-to-b from-primary-50 to-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-20">
          <div className="inline-block">
            <h2 className="text-5xl font-bold text-green-600 mb-6 leading-tight">
              Our Core Services
            </h2>
            <div className="h-1 w-24 bg-gradient-to-r from-primary-600 to-secondary-600 mx-auto mb-6 rounded-full"></div>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-light">
            Comprehensive solutions for drivers and companies in Rwanda's
            transportation sector
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 max-w-7xl mx-auto">
          {services.map((service, index) => (
            <div key={index} className="group relative">
              {/* Background decoration */}
              <div className="absolute inset-0 bg-gradient-to-br from-white to-gray-50 rounded-3xl transform rotate-1 group-hover:rotate-2 transition-transform duration-500"></div>

              {/* Main card */}
              <div className="relative bg-white rounded-3xl p-10 shadow-xl shadow-gray-200/50 border border-gray-100/50 group-hover:shadow-2xl group-hover:shadow-gray-300/30 transition-all duration-500 group-hover:-translate-y-2">
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-32 h-32 opacity-5 overflow-hidden rounded-3xl">
                  <div
                    className={`absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br ${service.gradient} rounded-full blur-xl`}
                  ></div>
                </div>

                {/* Icon with sophisticated styling */}
                <div className="relative mb-8">
                  <div
                    className={`w-20 h-20 bg-gradient-to-br ${service.gradient} rounded-2xl flex items-center justify-center shadow-lg shadow-${service.accentColor}/25 group-hover:shadow-xl group-hover:shadow-${service.accentColor}/40 transition-all duration-500 group-hover:scale-110`}
                  >
                    <service.icon
                      className="w-10 h-10 text-white"
                      strokeWidth={1.5}
                    />
                  </div>
                  <div
                    className={`absolute -bottom-2 -right-2 w-6 h-6 bg-gradient-to-br ${service.gradient} rounded-full opacity-60`}
                  ></div>
                </div>

                {/* Content */}
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-gray-900 group-hover:text-gray-800 transition-colors duration-300">
                    {service.title}
                  </h3>

                  <p className="text-gray-600 leading-relaxed font-light text-base">
                    {service.description}
                  </p>

                  {/* Subtle call-to-action indicator */}
                  <div className="flex items-center space-x-2 text-sm font-medium text-gray-400 group-hover:text-gray-600 transition-colors duration-300">
                    <span>Learn more</span>
                    <div className="w-4 h-px bg-current transform group-hover:w-8 transition-all duration-300"></div>
                  </div>
                </div>

                {/* Bottom accent line */}
                <div
                  className={`absolute bottom-0 left-8 right-8 h-px bg-gradient-to-r ${service.gradient} opacity-20 group-hover:opacity-40 transition-opacity duration-300`}
                ></div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom decorative element */}
        <div className="mt-20 text-center">
          <div className="inline-flex items-center space-x-4 text-gray-400">
            <div className="w-8 h-px bg-current"></div>
            <div className="w-2 h-2 bg-current rounded-full"></div>
            <div className="w-8 h-px bg-current"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicesSection;
