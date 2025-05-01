import React from "react";
import { motion } from "framer-motion";
import { BiCar, BiBuildings, BiUser, BiBook } from "react-icons/bi";
import { BsArrowRight } from "react-icons/bs";

const Feature = ({ icon: Icon, title, description, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all"
  >
    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
      <Icon className="text-2xl text-blue-600" />
    </div>
    <h3 className="text-lg font-semibold mb-2 text-gray-900">{title}</h3>
    <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
  </motion.div>
);

const TeamMember = ({ name, role, image, linkedin, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all"
  >
    <div className="flex items-center gap-4">
      <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-200">
        <img
          src={image || "/default-avatar.png"}
          alt={name}
          className="w-full h-full object-cover"
        />
      </div>
      <div>
        <h3 className="text-lg font-semibold text-gray-900">{name}</h3>
        <p className="text-gray-600 text-sm">{role}</p>
      </div>
    </div>
    {linkedin && (
      <a
        href={linkedin}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 inline-flex items-center text-blue-600 hover:text-blue-700 text-sm"
      >
        Connect on LinkedIn <BsArrowRight className="ml-1" />
      </a>
    )}
  </motion.div>
);

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="container mx-auto px-4 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Transforming Transportation in Rwanda
            </h1>
            <p className="text-xl text-blue-100">
              Connecting skilled drivers with opportunities and empowering
              businesses with reliable transportation solutions.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        {/* Mission Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto text-center mb-16"
        >
          <h2 className="text-3xl font-bold mb-6 text-gray-900">Our Mission</h2>
          <p className="text-gray-600 text-lg leading-relaxed">
            At Shoferi, we're revolutionizing the transportation industry in
            Rwanda by creating a seamless connection between skilled drivers and
            businesses. Our platform is designed to make hiring and finding
            driving opportunities efficient, transparent, and reliable.
          </p>
        </motion.div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Feature
            icon={BiCar}
            title="Driver Matching"
            description="Advanced matching system to connect drivers with the right opportunities based on skills and requirements."
            delay={0.1}
          />
          <Feature
            icon={BiBuildings}
            title="Business Solutions"
            description="Comprehensive tools for businesses to manage their transportation needs and find qualified drivers."
            delay={0.2}
          />
          <Feature
            icon={BiUser}
            title="Driver Profiles"
            description="Professional profiles for drivers to showcase their experience, certifications, and availability."
            delay={0.3}
          />
          <Feature
            icon={BiBook}
            title="Resources"
            description="Educational resources and support for both drivers and businesses to succeed in the transportation industry."
            delay={0.4}
          />
        </div>

        {/* Team Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold mb-8 text-center text-gray-900">
            Meet Our Team
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <TeamMember
              name="Sebineza Steven"
              role="CEO & Co-founder"
              linkedin="https://linkedin.com/in/sebineza-steven"
              delay={0.1}
            />
            <TeamMember
              name="Eliezer Nsengi"
              role="CTO & Co-founder"
              linkedin="https://linkedin.com/in/eliezer-nsengi"
              delay={0.2}
            />
            <TeamMember
              name="Gasore Mugwaneza"
              role="Lead Developer"
              linkedin="https://linkedin.com/in/gasore-mugwaneza"
              delay={0.3}
            />
          </div>
        </motion.div>

        {/* Vision Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto text-center"
        >
          <h2 className="text-3xl font-bold mb-6 text-gray-900">Our Vision</h2>
          <p className="text-gray-600 text-lg leading-relaxed">
            We envision a future where transportation in Rwanda is seamlessly
            connected, efficient, and accessible. Through technology and
            innovation, we're building a comprehensive ecosystem that empowers
            both drivers and businesses to thrive in the modern economy.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default About;
