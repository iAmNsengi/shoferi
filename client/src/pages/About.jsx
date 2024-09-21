import React from "react";
import { FaCar, FaUserTie, FaGraduationCap, FaComments } from "react-icons/fa";
import { motion } from "framer-motion";

const Feature = ({ icon, title, description, delay }) => (
  <motion.div
    className="flex flex-col items-center p-6 bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    whileHover={{ scale: 1.05 }}
  >
    <motion.div
      className="text-4xl text-orange-600 mb-4"
      whileHover={{ rotate: 360 }}
      transition={{ duration: 0.5 }}
    >
      {icon}
    </motion.div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-gray-600 text-center">{description}</p>
  </motion.div>
);

const TeamMember = ({ name, role, image, delay }) => (
  <motion.div
    className="flex flex-col items-center"
    initial={{ opacity: 0, scale: 0.5 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5, delay }}
    whileHover={{ y: -10 }}
  >
    <img
      src={image}
      alt={name}
      className="w-32 h-32 rounded-full mb-4 object-cover border-4 border-orange-500 hover:border-orange-600 transition-colors duration-300"
    />
    <h3 className="text-lg font-semibold">{name}</h3>
    <p className="text-gray-600">{role}</p>
  </motion.div>
);

const GradientText = ({ children }) => (
  <span className="bg-clip-text font-extrabold text-transparent bg-gradient-to-r from-orange-300 to-orange-800">
    {children}
  </span>
);

export default function About() {
  return (
    <div className=" min-h-screen">
      <motion.header
        className="bg-gray-600 text-white py-16"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto px-4 text-center">
          <motion.h1
            className="text-5xl font-bold mb-2"
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            About <GradientText>shoferi.com</GradientText>
          </motion.h1>
          <motion.p
            className="text-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            Connecting Drivers and Companies in Rwanda
          </motion.p>
        </div>
      </motion.header>

      <main className="container mx-auto px-4 py-16">
        <motion.section
          className="mb-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <h2 className="text-4xl font-semibold mb-6 text-center">
            Our <GradientText>Mission</GradientText>
          </h2>
          <p className="text-gray-700 max-w-3xl mx-auto text-center text-lg leading-relaxed">
            At Shoferi, we're dedicated to revolutionizing the driving industry
            in Rwanda. Our platform serves as a bridge, connecting skilled
            drivers with companies in need of their expertise, creating
            opportunities and fostering growth in the transportation sector.
          </p>
        </motion.section>

        <section className="mb-20">
          <h2 className="text-4xl font-semibold mb-10 text-center">
            Our <GradientText>Services</GradientText>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Feature
              icon={<FaCar />}
              title="Driver Job Matching"
              description="We connect skilled drivers in Rwanda with job opportunities that match their expertise."
              delay={0.2}
            />
            <Feature
              icon={<FaUserTie />}
              title="Company Hiring Solutions"
              description="We provide efficient driver hiring solutions for companies in need of reliable transportation professionals."
              delay={0.4}
            />
            <Feature
              icon={<FaGraduationCap />}
              title="Future: Driving School"
              description="We plan to establish a driving school to help aspiring drivers obtain their licenses easily in Rwanda."
              delay={0.6}
            />
            <Feature
              icon={<FaComments />}
              title="Future: Social Platform"
              description="We're developing a social media platform for drivers and companies to network and communicate."
              delay={0.8}
            />
          </div>
        </section>

        <motion.section
          className="mb-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1 }}
        >
          <h2 className="text-4xl font-semibold mb-6 text-center">
            Our <GradientText>Vision</GradientText>
          </h2>
          <p className="text-gray-700 max-w-3xl mx-auto text-center text-lg leading-relaxed">
            We're not just stopping at job connections. Shoferi is committed to
            continuous innovation and improvement in the driving industry. Our
            vision includes creating a comprehensive ecosystem for drivers and
            companies, including networking opportunities and education.
          </p>
        </motion.section>

        <section>
          <h2 className="text-4xl font-semibold mb-10 text-center">
            Meet Our <GradientText>Team</GradientText>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12">
            <TeamMember
              name="Sebineza Steven"
              role="CEO"
              image="/api/placeholder/150"
              delay={0.2}
            />
            <TeamMember
              name="Eliezer Nsengi"
              role="Co-Founder & CTO"
              image="/api/placeholder/150"
              delay={0.4}
            />
            <TeamMember
              name="Gasore Mugwaneza"
              role="CTO"
              image="/api/placeholder/150"
              delay={0.6}
            />
          </div>
        </section>
      </main>
    </div>
  );
}
