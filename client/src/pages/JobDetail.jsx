import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import moment from "moment";
import {
  BiBriefcase,
  BiTimeFive,
  BiMoney,
  BiMap,
  BiArrowBack,
} from "react-icons/bi";
import { BsBuildings, BsPeople } from "react-icons/bs";
import { apiRequest } from "../utils";
import { CustomButton } from "../components";

const JobDetail = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applied, setApplied] = useState(false);

  useEffect(() => {
    fetchJobDetails();
    checkIfApplied();
  }, [id]);

  const fetchJobDetails = async () => {
    try {
      const res = await apiRequest({
        url: `/jobs/details/${id}`,
        method: "GET",
      });

      setJob(res?.data || null);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const checkIfApplied = async () => {
    try {
      const res = await apiRequest({
        url: `/jobs/${id}/check-application`,
        method: "GET",
      });

      setApplied(res?.applied || false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleApply = async () => {
    try {
      const res = await apiRequest({
        url: `/jobs/${id}/apply`,
        method: "POST",
      });

      if (res?.success) {
        setApplied(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center"
        >
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <BiBriefcase className="text-3xl text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Job Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            The job posting you're looking for doesn't exist or has been
            removed.
          </p>
          <Link
            to="/find-jobs"
            className="inline-flex items-center text-blue-600 hover:text-blue-700"
          >
            <BiArrowBack className="mr-2" />
            Back to Jobs
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-20">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-6 mb-8"
        >
          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-20 h-20 bg-blue-100 rounded-xl flex items-center justify-center">
              <BsBuildings className="text-3xl text-blue-600" />
            </div>

            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    {job.jobTitle}
                  </h1>
                  <p className="text-gray-600">{job.company?.name}</p>
                </div>

                <CustomButton
                  title={applied ? "Applied" : "Apply Now"}
                  containerStyles={`${
                    applied ? "bg-green-600" : "bg-blue-600 hover:bg-blue-700"
                  } text-white px-6 py-2.5 rounded-lg transition-colors`}
                  onClick={handleApply}
                  disabled={applied}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="flex items-center gap-2 text-gray-600">
                  <BiTimeFive className="text-xl" />
                  <span>Posted {moment(job.createdAt).fromNow()}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <BiMap className="text-xl" />
                  <span>{job.location}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <BiMoney className="text-xl" />
                  <span>${job.salary}/year</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Job Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="md:col-span-2 space-y-8"
          >
            {/* Description */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Job Description</h2>
              <div className="prose prose-blue max-w-none">
                {job.detail?.[0]?.desc || "No description available"}
              </div>
            </div>

            {/* Requirements */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Requirements</h2>
              <div className="prose prose-blue max-w-none">
                {job.detail?.[0]?.requirements || "No requirements specified"}
              </div>
            </div>
          </motion.div>

          {/* Job Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-lg p-6 h-fit"
          >
            <h2 className="text-xl font-semibold mb-4">Job Overview</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <BiBriefcase className="text-xl text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Job Type</p>
                  <p className="font-medium">{job.jobType}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <BsPeople className="text-xl text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">No. of Vacancies</p>
                  <p className="font-medium">
                    {job.vacancies || "Not specified"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <BiTimeFive className="text-xl text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Experience</p>
                  <p className="font-medium">
                    {job.experience
                      ? `${job.experience} years`
                      : "Not specified"}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default JobDetail;
