import { BiBuildings, BiCar, BiUser } from "react-icons/bi";
import ServiceCard from "../ServiceCard";

const ServicesSection = () => {
  return (
    <div className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Our Core Services
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Comprehensive solutions for drivers and companies in Rwanda's
            transportation sector
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <ServiceCard
            icon={BiCar}
            title="Driver Jobs"
            description="Find verified driving opportunities with top companies across Rwanda. From delivery services to corporate transportation."
            gradient="bg-gradient-to-br from-blue-500 to-cyan-500"
          />
          <ServiceCard
            icon={BiBuildings}
            title="Company Hiring"
            description="Connect with qualified, verified drivers for your business needs. Streamlined hiring process with background checks."
            gradient="bg-gradient-to-br from-purple-500 to-pink-500"
          />
          <ServiceCard
            icon={BiUser}
            title="Driver Training"
            description="Professional development programs to enhance driving skills, safety awareness, and career advancement opportunities."
            gradient="bg-gradient-to-br from-green-500 to-emerald-500"
          />
        </div>
      </div>
    </div>
  );
};

export default ServicesSection;
