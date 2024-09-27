import React, { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { HiLocationMarker } from "react-icons/hi";
import { AiOutlineMail } from "react-icons/ai";
import { FiPhoneCall, FiEdit3, FiUpload } from "react-icons/fi";
import { Link, useParams } from "react-router-dom";
import { companies, jobs } from "../utils/data";
import { CustomButton, JobCard, Loading, TextInput } from "../components";
import { useCompanies } from "../hooks/useCompanies";
import Notification from "../components/Notification";
import CompanyForm from "../components/Forms/CompanyForm";

const CompanyProfile = () => {
  const params = useParams();
  const { user } = useSelector((state) => state.user);
  const [openForm, setOpenForm] = useState(false);

  const { company, loading, error, getCompany } = useCompanies();

  useEffect(() => {
    getCompany(params.id);
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);

  return (
    <div className="container mx-auto p-5">
      <div className="">
        <div className="w-full flex flex-col md:flex-row gap-3 justify-between">
          <h2 className="text-gray-600 text-xl font-semibold">
            Welcome to {company?.name}
          </h2>

          {user?.user?.accountType === undefined &&
            company?._id === user?.user?._id && (
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
          <p className="flex gap-1 items-center   px-3 py-1 text-slate-600 rounded-full">
            <HiLocationMarker /> {company?.location ?? "No Location"}
          </p>
          <p className="flex gap-1 items-center   px-3 py-1 text-slate-600 rounded-full">
            <AiOutlineMail /> {company?.email ?? "No Email"}
          </p>
          <p className="flex gap-1 items-center   px-3 py-1 text-slate-600 rounded-full">
            <FiPhoneCall /> {company?.contact ?? "No Contact"}
          </p>

          <div className="flex flex-col items-center mt-10 md:mt-0">
            <span className="text-xl">{company?.jobPosts?.length}</span>
            <p className="text-blue-600 ">Job Post</p>
          </div>
        </div>
      </div>

      <div className="w-full mt-20 flex flex-col gap-2">
        <p>Jobs Posted</p>
        {loading && <Loading />}
        {!loading && company.jobPosts && !company.jobPosts.length && (
          <Notification message="No jobs added yet!" />
        )}

        {company.jobPosts && (
          <div className="flex flex-wrap gap-3">
            {company.jobPosts.map((job, index) => (
              <JobCard job={job} key={index} />
            ))}
          </div>
        )}
      </div>

      <CompanyForm open={openForm} setOpen={setOpenForm} />
    </div>
  );
};

export default CompanyProfile;
