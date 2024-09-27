import React from "react";
import { GoLocation } from "react-icons/go";
import moment from "moment";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const JobCard = ({ job }) => {
  return (
    <Link to={`/job-detail/${job?._id}`}>
      <motion.div
        className="w-96 md:w-[20rem] px-4 h-auto min-h-[16rem] md:min-h-[18rem] bg-white flex flex-col justify-between shadow-lg 
                rounded-md py-6 hover:shadow-xl transition-shadow duration-300"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.98 }}
      >
        <motion.div
          className="flex gap-3"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <motion.img
            src={
              job?.company?.profileUrl ||
              `https://avatar.iran.liara.run/username?username=-`
            }
            alt={job?.company?.name}
            className="w-14 h-14 rounded-full"
            whileHover={{ scale: 1.1, rotate: 5 }}
          />

          <div className="w-fit truncate">
            <motion.p
              className="text-lg font-semibold truncate"
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {job?.jobTitle}
            </motion.p>
            <motion.span
              className="flex gap-2 items-center text-sm"
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <GoLocation className="text-slate-900" />
              {job?.location}
            </motion.span>
          </div>
        </motion.div>

        <motion.div
          className="py-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <p className="text-sm line-clamp-3">{job?.detail[0]?.desc}</p>
        </motion.div>

        <motion.div
          className="flex items-center justify-between"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <motion.p
            className="bg-orange-100 text-orange-600 py-1 px-2 rounded font-semibold text-sm"
            whileHover={{ scale: 1.05 }}
          >
            {job?.jobType}
          </motion.p>
          <span className="text-gray-500 text-sm">
            {moment(job?.createdAt).fromNow()}
          </span>
        </motion.div>
      </motion.div>
    </Link>
  );
};

export default JobCard;
