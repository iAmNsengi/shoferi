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
    <div className="relative py-20 bg-white overflow-hidden">
      {/* Blurred background image */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1)), linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(22, 163, 74, 0.1)), url('https://images.unsplash.com/photo-1650493281263-c6e2df6f9f13?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDN8fHRlYW0lMjBoYXBweXxlbnwwfDB8MHx8fDA%3D')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
          filter: "blur(2px)",
        }}
      ></div>

      {/* Enhanced green overlays */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-500/15 via-green-600/10 to-green-700/5"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-green-400/20 via-transparent to-green-500/15"></div>

      {/* Animated green blobs */}
      <div className="absolute top-10 left-10 w-64 h-64 bg-green-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
      <div className="absolute bottom-10 right-10 w-64 h-64 bg-green-500 rounded-full mix-blend-multiply filter blur-xl opacity-15 animate-blob animation-delay-2000"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-green-300 rounded-full mix-blend-multiply filter blur-2xl opacity-10 animate-pulse"></div>

      {/* Green gradient overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-green-900/5 via-transparent to-green-800/10"></div>

      <div className="relative container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black text-white mb-4">
            Success Stories
          </h2>
          <p className="text-xl text-white">
            Hear from drivers and companies who found success with Shoferi
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 hover:shadow-xl transition-all duration-300 border border-green-100 hover:border-green-200"
            >
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-green-700 rounded-full flex items-center justify-center text-white font-bold">
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
