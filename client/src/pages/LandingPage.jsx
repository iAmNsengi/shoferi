import React, { useState } from "react";
import {
  BiCar,
  BiBuildings,
  BiUser,
  BiCheckCircle,
  BiTime,
  BiPlay,
} from "react-icons/bi";
import { BsArrowRight, BsStarFill, BsCalendarCheck } from "react-icons/bs";

const HeroSection = () => {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 overflow-hidden pt-16">
      {/* Decorative Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-1/4 w-64 h-64 bg-white rounded-full blur-3xl"></div>
      </div>

      <div className="relative container mx-auto px-4 py-20">
        <div className="flex flex-col lg:flex-row items-center min-h-[80vh]">
          {/* Left Content */}
          <div className="lg:w-1/2 text-center lg:text-left mb-12 lg:mb-0">
            <div className="inline-flex items-center bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
              <span className="text-white text-sm font-medium">
                🚗 DRIVING OPPORTUNITIES
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              With Shoferi Drivers,
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300">
                Everything Is Easier
              </span>
            </h1>

            <p className="text-xl text-purple-100 mb-8 leading-relaxed max-w-lg mx-auto lg:mx-0">
              Shoferi is the top platform designed for connecting skilled
              drivers with top companies across Rwanda. Find your perfect
              driving opportunity today.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button className="bg-white text-purple-700 px-8 py-4 rounded-full font-semibold hover:shadow-xl transition-all hover:scale-105">
                Find Driving Jobs
              </button>
              <button className="flex items-center justify-center gap-2 bg-transparent border-2 border-white text-white px-8 py-4 rounded-full font-semibold hover:bg-white hover:text-purple-700 transition-all">
                <BiPlay className="text-xl" />
                What's Shoferi?
              </button>
            </div>
          </div>

          {/* Right Content - Hero Image/Card */}
          <div className="lg:w-1/2 relative">
            <div className="relative bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20">
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-3xl"></div>
              <div className="relative">
                <div className="w-full h-80 bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl mb-6 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-black/20"></div>
                  <div className="relative text-center text-white">
                    <BiCar className="text-6xl mx-auto mb-4" />
                    <h3 className="text-xl font-semibold">
                      Professional Drivers
                    </h3>
                    <p className="text-sm opacity-90">
                      Connecting talent with opportunity
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-white mb-1">
                      1000+
                    </div>
                    <div className="text-purple-100 text-sm">Active Jobs</div>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-white mb-1">
                      500+
                    </div>
                    <div className="text-purple-100 text-sm">Companies</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <div className="absolute left-8 top-1/2 transform -translate-y-1/2 hidden lg:block">
        <button className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all">
          <BsArrowRight className="rotate-180" />
        </button>
      </div>
      <div className="absolute right-8 top-1/2 transform -translate-y-1/2 hidden lg:block">
        <button className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all">
          <BsArrowRight />
        </button>
      </div>
    </div>
  );
};

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

const StatsSection = () => {
  const stats = [
    { number: "2000+", label: "Drivers Hired" },
    { number: "1000+", label: "Active Jobs" },
    { number: "500+", label: "Partner Companies" },
    { number: "98%", label: "Success Rate" },
  ];

  return (
    <div className="py-16 bg-gradient-to-r from-purple-600 to-indigo-700">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                {stat.number}
              </div>
              <div className="text-purple-200 text-lg">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

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

const CTASection = () => {
  return (
    <div className="py-20 bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 relative overflow-hidden">
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

const LandingPage = () => {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <ServicesSection />
      <StatsSection />
      <TestimonialsSection />
      <CTASection />
    </div>
  );
};

export default LandingPage;
