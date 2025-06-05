import { BsArrowRight } from "react-icons/bs";

const ServiceCard = ({ icon: Icon, title, description, gradient }) => (
  <div className="group relative">
    <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
    <div className="relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 group-hover:transform group-hover:scale-105">
      <div
        className={`w-20 h-20 ${gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}
      >
        <Icon className="text-3xl text-white" />
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
      <div className="mt-6">
        <button className="text-purple-600 font-semibold hover:text-purple-700 transition-colors flex items-center gap-2">
          Learn More <BsArrowRight />
        </button>
      </div>
    </div>
  </div>
);

export default ServiceCard;
