import moment from 'moment';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { CustomButton, JobCard, Loading } from '../components';
import { useJobs } from '../hooks/useJobs';
import { applyJobAction } from '../redux/slices/jobSlice';

const JobDetail = () => {
  const { loading: applyJobLoading } = useSelector((store) => store.job);
  const dispatch = useDispatch();
  const params = useParams();
  const [selected, setSelected] = useState('0');

  const { job, jobs, loading, error, getJobById, getJobs } = useJobs();
  useEffect(() => {
    getJobById(params.id);
    getJobs();
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }, [params.id]);
  if (loading)
    return (
      <div className="mt-20">
        <Loading />
      </div>
    );
  async function handleApplyJob() {
    const response = await dispatch(applyJobAction(params?.id));
    if (response.error) {
      toast.error(response.payload);
    } else {
      toast.success(response.payload.message);
    }
  }

  return (
    <div className="container mx-auto">
      <div className="w-full flex flex-col md:flex-row gap-10">
        {/* LEFT SIDE */}
        <div className="w-full h-fit md:w-2/3 2xl:2/4 bg-white px-5 py-10 md:px-10 shadow-md">
          <div className="w-full flex items-center justify-between">
            <div className="w-3/4 flex gap-2">
              <img
                src={job?.company?.profileUrl}
                alt={job?.company?.name}
                className="w-20 h-20 md:w-24 md:h-20 rounded"
              />

              <div className="flex flex-col">
                <p className="text-xl font-semibold text-gray-600">
                  {job?.jobTitle}
                </p>

                <span className="text-base">{job?.location}</span>

                <span className="text-base text-blue-600">
                  {job?.company?.name}
                </span>

                <span className="text-gray-500 text-sm">
                  {moment(job?.createdAt).fromNow()}
                </span>
              </div>
            </div>
          </div>

          <div className="w-full flex flex-wrap md:flex-row  items-center justify-center gap-5 my-10">
            <div className="border border-gray-400 w-40 h-16 rounded-lg flex flex-col items-center justify-center">
              <span className="text-sm">Salary</span>
              <p className="text-lg font-semibold text-gray-700">
                {job?.salary} Frw
              </p>
            </div>

            <div className="border border-gray-400 w-40 h-16 rounded-lg flex flex-col items-center justify-center">
              <span className="text-sm">Job Type</span>
              <p className="text-lg font-semibold text-gray-700">
                {job?.jobType}
              </p>
            </div>

            <div className="border border-gray-400 w-40 h-16 px-6 rounded-lg flex flex-col items-center justify-center">
              <span className="text-sm">Applicants</span>
              <p className="text-lg font-semibold text-gray-700">
                {job?.application?.length || 0}
              </p>
            </div>
          </div>

          <div className="w-full flex gap-4 py-5">
            <CustomButton
              onClick={() => setSelected('0')}
              title="Job Description"
              containerStyles={`w-full flex items-center justify-center py-3 px-5 outline-none rounded-full text-sm ${
                selected === '0'
                  ? 'bg-orange-500 text-white'
                  : 'bg-white text-black border border-gray-300'
              }`}
            />

            <CustomButton
              onClick={() => setSelected('1')}
              title="Company"
              containerStyles={`w-full flex items-center justify-center  py-3 px-5 outline-none rounded-full text-sm ${
                selected === '1'
                  ? 'bg-orange-500 text-white'
                  : 'bg-white text-black border border-gray-300'
              }`}
            />
          </div>

          <div className="my-6">
            {selected === '0' ? (
              <>
                <p className="text-xl font-semibold underline">
                  Job Decsription
                </p>

                <span className="text-base">{job?.detail[0]?.desc}</span>

                {job?.detail[0]?.requirements && (
                  <>
                    <p className="text-xl font-semibold mt-8 underline">
                      Requirement
                    </p>
                    <span className="text-base">
                      {job?.detail[0]?.requirements}
                    </span>
                  </>
                )}
              </>
            ) : (
              <>
                <div className="mb-6 flex flex-col">
                  <p className="text-xl text-blue-600 font-semibold">
                    {job?.company?.name}
                  </p>
                  <span className="text-base">{job?.company?.location}</span>
                  <span className="text-sm">{job?.company?.email}</span>
                </div>

                <p className="text-xl font-semibold">About Company</p>
                <span>{job?.company?.about}</span>
              </>
            )}
          </div>

          <div className="w-full">
            <CustomButton
              title={applyJobLoading ? 'Applying ...' : 'Apply Now'}
              containerStyles={`w-full flex items-center justify-center text-white bg-orange-500 py-3 px-5 outline-none rounded-full text-base`}
              onClick={handleApplyJob}
            />
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="w-full md:w-1/3 2xl:w-2/4 p-5 mt-20 md:mt-0">
          <p className="text-gray-500 font-semibold">Similar Job Post</p>

          <div className="w-full flex flex-wrap gap-4">
            {jobs?.slice(0, 6).map((job, index) => (
              <JobCard job={job} key={index} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetail;
