import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { HiLocationMarker } from "react-icons/hi";
import { AiOutlineMail } from "react-icons/ai";
import { FiPhoneCall } from "react-icons/fi";
import { CustomButton, Loading, TextInput } from "../components";
import UserForm from "../components/Forms/UserForm";
import { useParams } from "react-router-dom";
import { useCompanies } from "../hooks/useCompanies";
import { useUsers } from "../hooks/useUsers";
import { useJobs } from "../hooks/useJobs";
import moment from "moment";

const UserProfile = () => {
  const { user, loading, error, getUser } = useUsers();
  const { auth: loggedInUser } = useSelector((state) => state.user);
  const { jobs, getJobs } = useJobs();
  const params = useParams();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    getUser(params.id || loggedInUser.user._id);
    getJobs();
  }, []);
  if (loading) return <Loading />;

  const appliedJobs = jobs.filter((job) =>
    job.application.includes(loggedInUser.user._id)
  );
  console.log(appliedJobs);

  return (
    <div className="container mx-auto flex items-center justify-center py-10">
      <div className="w-full md:w-2/3 2xl:w-2/4 bg-white shadow-lg p-10 pb-20 rounded-lg">
        <div className="flex flex-col items-center justify-center mb-4">
          <h1 className="text-4xl font-semibold text-slate-600">
            {user?.firstName + " " + user?.lastName}
          </h1>

          <h5 className="text-blue-700 text-base font-bold">
            {user?.jobTitle || "Add Job Title"}
          </h5>

          <div className="w-full flex flex-wrap lg:flex-row justify-between mt-8 text-sm">
            <p className="flex gap-1 items-center justify-center  px-3 py-1 text-slate-600 rounded-full">
              <HiLocationMarker /> {user?.location ?? "No Location"}
            </p>
            <p className="flex gap-1 items-center justify-center  px-3 py-1 text-slate-600 rounded-full">
              <AiOutlineMail /> {user?.email ?? "No Email"}
            </p>
            <p className="flex gap-1 items-center justify-center  px-3 py-1 text-slate-600 rounded-full">
              <FiPhoneCall /> {user?.contact ?? "No Contact"}
            </p>
          </div>
        </div>

        <hr />

        <div className="w-full py-10">
          <div className="w-full flex flex-col-reverse items-center md:flex-row gap-8 py-6">
            <div className="w-full md:w-2/3 flex flex-col gap-4 text-lg text-slate-600 mt-20 md:mt-0">
              <p className="text-[#0536e7]  font-semibold text-2xl">ABOUT</p>
              <span className="text-base text-justify leading-7">
                {user?.about ?? "No About Found"}
              </span>
            </div>

            <div className="w-full md:w-1/3 h-44">
              <img
                src={user?.profileUrl}
                alt={user?.firstName}
                className="w-full h-48 object-contain rounded-lg"
              />
              <button
                className="w-full md:w-56 bg-orange-600 text-white mt-4 py-2 rounded"
                onClick={() => setOpen(true)}
              >
                Edit Profile
              </button>
            </div>
          </div>
        </div>
        <div className="bg-white shadow-lg p-2 rounded-lg mt-2">
          <h2 className="text-2xl font-semibold text-slate-600 mb-6 p-2">
            Applied Jobs
          </h2>
          <div className="overflow-x-auto w-full">
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 text-left">Job Title</th>
                  <th className="px-4 py-2 text-left">Company</th>
                  <th className="px-4 py-2 text-left">Application Date</th>
                  <th className="px-4 py-2 text-left">Status</th>
                  <th className="px-4 py-2 text-left">Response</th>
                </tr>
              </thead>
              <tbody>
                {appliedJobs.map((job, index) => (
                  <tr
                    key={job._id}
                    className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                  >
                    <td className="px-4 py-2 text-sm">{job.jobTitle}</td>
                    <td className="px-4 py-2 text-sm">{job.company.name}</td>
                    <td className="px-4 py-2">
                      {moment(job.application.appliedAt).format("ll")}
                    </td>
                    <td className="px-4 py-2 text-sm">
                      {job.application.status || "Pending"}{" "}
                    </td>
                    <td className="px-4 py-2 text-sm">
                      {job.application.response || "Pending"}{" "}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {appliedJobs.length === 0 && (
            <p className="text-center text-gray-500 mt-4">
              No applied jobs found.
            </p>
          )}
        </div>
      </div>

      <UserForm value={user} open={open} setOpen={setOpen} />
    </div>
  );
};

export default UserProfile;
