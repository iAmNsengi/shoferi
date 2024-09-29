import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { HiLocationMarker } from "react-icons/hi";
import { AiOutlineMail } from "react-icons/ai";
import {
  FiPhoneCall,
  FiEdit3,
  FiUpload,
  FiChevronDown,
  FiChevronUp,
  FiCalendar,
} from "react-icons/fi";
import { Link, useParams } from "react-router-dom";
import { CustomButton, Loading } from "../components";
import { useCompanies } from "../hooks/useCompanies";
import Notification from "../components/Notification";
import CompanyForm from "../components/Forms/CompanyForm";

const CompanyProfile = () => {
  const params = useParams();
  const { auth: loggedInUser } = useSelector((store) => store.user);
  const { company: loggedInCompany } = useSelector((store) => store.company);
  const [openForm, setOpenForm] = useState(false);
  const [expandedJob, setExpandedJob] = useState(null);
  const [selectedApplicant, setSelectedApplicant] = useState(null);

  const { company, loading, error, getCompany } = useCompanies();

  useEffect(() => {
    getCompany(params.id || loggedInCompany.user._id);
  }, []);

  const toggleJobExpansion = (jobId) => {
    setExpandedJob(expandedJob === jobId ? null : jobId);
    setSelectedApplicant(null);
  };

  const selectApplicant = (applicant) => {
    setSelectedApplicant(applicant);
  };

  return (
    <div className="container mx-auto p-5">
      <div className="">
        <div className="w-full flex flex-col md:flex-row gap-3 justify-between">
          <h2 className="text-gray-600 text-xl font-semibold">
            Welcome to {company?.name}
          </h2>

          {loggedInUser?.user?.accountType === undefined &&
            loggedInCompany?._id === loggedInUser?.user?._id && (
              <div className="flex items-center justifu-center py-5 md:py-0 gap-4">
                <CustomButton
                  onClick={() => setOpenForm(true)}
                  iconRight={<FiEdit3 />}
                  containerStyles={`py-1.5 px-3 md:px-5 focus:outline-none bg-blue-600  hover:bg-blue-700 text-white rounded text-sm md:text-base border border-blue-600`}
                />

                <Link to="/upload-job">
                  <CustomButton
                    title="Upload Job"
                    iconRight={<FiUpload />}
                    containerStyles={`text-blue-600 py-1.5 px-3 md:px-5 focus:outline-none  rounded text-sm md:text-base border border-blue-600`}
                  />
                </Link>
              </div>
            )}
        </div>

        <div className="w-full flex flex-col md:flex-row justify-start md:justify-between mt-4 md:mt-8 text-sm">
          <p className="flex gap-1 items-center px-3 py-1 text-slate-600 rounded-full">
            <HiLocationMarker /> {company?.location ?? "No Location"}
          </p>
          <p className="flex gap-1 items-center px-3 py-1 text-slate-600 rounded-full">
            <AiOutlineMail /> {company?.email ?? "No Email"}
          </p>
          <p className="flex gap-1 items-center px-3 py-1 text-slate-600 rounded-full">
            <FiPhoneCall /> {company?.contact ?? "No Contact"}
          </p>

          <div className="flex flex-col items-center mt-10 md:mt-0">
            <span className="text-xl">{company?.jobPosts?.length}</span>
            <p className="text-blue-600 ">Job Post</p>
          </div>
        </div>
      </div>

      <div className="w-full mt-20 flex flex-col gap-2">
        <h2 className="text-2xl font-semibold mb-4 flex items-center gap-4">
          Job Posts and Applicants
          <span className="text-base text-gray-500">
            ({company?.jobPosts?.length})
          </span>
        </h2>
        {loading && <Loading />}
        {!loading && company?.jobPosts && !company.jobPosts.length && (
          <Notification message="No jobs added yet!" />
        )}

        {company?.jobPosts && (
          <div className="flex flex-col gap-6">
            {company.jobPosts.map((job, index) => (
              <div key={job._id} className="border rounded-lg p-4">
                <div
                  className="flex justify-between items-center cursor-pointer"
                  onClick={() => toggleJobExpansion(job._id)}
                >
                  {" "}
                  {index + 1}.
                  <h3 className="text-xl font-semibold flex items-center gap-3 divide-x-2 space-x-2">
                    <span>{job.jobTitle}</span>
                    <span className="text-sm text-gray-500">{job.jobType}</span>
                    <span className="text-sm text-gray-500">
                      {job.location}
                    </span>
                    <span className="flex items-center gap-1 text-sm text-gray-500">
                      <FiCalendar />
                      {job.createdAt}
                    </span>
                  </h3>
                  {expandedJob === job._id ? (
                    <FiChevronUp />
                  ) : (
                    <FiChevronDown />
                  )}
                </div>

                {expandedJob === job._id && (
                  <div className="mt-4">
                    <h4 className="text-lg font-semibold mb-2">Applicants:</h4>
                    {job.application && job.application.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {job.application.map((applicant) => (
                          <div
                            key={applicant._id}
                            className="border p-2 rounded cursor-pointer hover:bg-gray-100"
                            onClick={() => selectApplicant(applicant)}
                          >
                            {applicant.name}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p>No applicants yet.</p>
                    )}

                    {selectedApplicant && (
                      <div className="mt-4 p-4 border rounded-lg">
                        <h5 className="text-lg font-semibold mb-2">
                          Applicant Details:
                        </h5>
                        <p>
                          <strong>Name:</strong> {selectedApplicant.name}
                        </p>
                        <p>
                          <strong>Email:</strong> {selectedApplicant.email}
                        </p>
                        {/* Add more applicant details as needed */}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      {openForm && (
        <CompanyForm value={company} open={openForm} setOpen={setOpenForm} />
      )}
    </div>
  );
};

export default CompanyProfile;
