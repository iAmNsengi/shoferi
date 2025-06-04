import { BsStarFill } from "react-icons/bs";

const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "Jean Baptiste",
      role: "Professional Driver",
      company: "Kigali Transport Co.",
      content:
        "Shoferi transformed my career. I found my dream job within a week of joining the platform.",
      rating: 5,
      avatar: "JB",
    },
    {
      name: "Marie Claire",
      role: "HR Manager",
      company: "Rwanda Logistics",
      content:
        "The quality of drivers on Shoferi is exceptional. Our hiring process is now 50% faster.",
      rating: 5,
      avatar: "MC",
    },
    {
      name: "Samuel Nkurunziza",
      role: "Fleet Manager",
      company: "East Africa Express",
      content:
        "Reliable, professional drivers. Shoferi has become our go-to platform for all hiring needs.",
      rating: 5,
      avatar: "SN",
    },
  ];

  return (
    <div className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Success Stories
          </h2>
          <p className="text-xl text-gray-600">
            Hear from drivers and companies who found success with Shoferi
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-gray-50 rounded-2xl p-8 hover:shadow-lg transition-all"
            >
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
                  {testimonial.avatar}
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold text-gray-900">
                    {testimonial.name}
                  </h4>
                  <p className="text-gray-600 text-sm">{testimonial.role}</p>
                </div>
              </div>

              <div className="flex mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <BsStarFill key={i} className="text-yellow-400" />
                ))}
              </div>

              <p className="text-gray-700 leading-relaxed">
                {testimonial.content}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TestimonialsSection;
