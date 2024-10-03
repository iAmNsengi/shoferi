import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const CompanyCard = ({ cmp }) => {
  return (
    <motion.div
      className="w-full md:w-fit h-auto min-h-16 flex flex-col sm:flex-row gap-4 items-center justify-between bg-white shadow-md rounded px-4 py-3 sm:py-2"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02, boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}
    >
      <motion.div
        className="w-full sm:w-3/4 md:w-2/4 flex gap-4 items-center"
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <Link to={`/company-profile/${cmp?._id}`}>
          <motion.img
            src={
              cmp?.profileUrl ||
              `https://avatar.iran.liara.run/username?username=-`
            }
            alt={cmp?.name}
            className="w-12 h-12 rounded-full object-cover"
            whileHover={{ scale: 1.1, rotate: 5 }}
          />
        </Link>
        <div className="flex flex-col">
          <Link
            to={`/company-profile/${cmp?._id}`}
            className="text-lg font-semibold text-gray-600 truncate hover:text-blue-600 transition-colors"
          >
            {cmp?.name}
          </Link>
          <motion.span
            className="text-sm text-blue-600"
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {cmp?.email}
          </motion.span>
        </div>
      </motion.div>

      <motion.div
        className="hidden md:flex w-1/4 items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <p className="text-base text-start text-gray-600">{cmp?.location}</p>
      </motion.div>

      <motion.div
        className="flex flex-col items-center sm:items-end"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <motion.p
          className="text-blue-600 font-semibold text-lg"
          whileHover={{ scale: 1.1 }}
        >
          {cmp?.jobPosts?.length}
        </motion.p>
        <span className="text-sm font-normal text-gray-600">Jobs Posted</span>
      </motion.div>
    </motion.div>
  );
};

export default CompanyCard;
