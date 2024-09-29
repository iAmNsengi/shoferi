import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  CustomButton,
  JobCard,
  JobTypes,
  Loading,
  TextInput,
} from "../components";
import { useJobs } from "../hooks/useJobs";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { createJobAction } from "../redux/slices/jobSlice";

const UploadJob = () => {
  const { jobs, loading, getJobs } = useJobs();
  const [jobType, setJobType] = useState("Full-Time");
  const dispatch = useDispatch();

  const { company } = useSelector((store) => store.company);

  useEffect(() => {
    getJobs();
  }, []);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    defaultValues: {},
  });

  const [errMsg, setErrMsg] = useState("");
  const [jobTitle, setJobTitle] = useState("Full-Time");

  const onSubmit = async (data) => {
    const jobData = {
      ...data,
      jobType: jobType,
    };
    console.log(jobData);
    try {
      const response = await dispatch(createJobAction(jobData));
      if (response.payload) {
        toast.success("Job added Successfully");
        reset();
      } else {
        console.error("Error adding job");
        // Check if response.error is an object or a string
        if (typeof response.error === "object") {
          setErrMsg(response.error.message || "An error occurred");
        } else {
          setErrMsg(response.error || "An error occurred");
        }
        toast.error("An error occurred");
      }
    } catch (error) {
      console.log(error);
      setErrMsg(error.message || "An error occurred");
      toast.error(errMsg);
    }
  };

  return (
    <div className="container mx-auto flex flex-col md:flex-row gap-8 2xl:gap-14 bg-[#f7fdfd] px-5 py-16">
      <div className="w-full h-fit md:w-2/3 2xl:2/4 bg-white px-5 py-10 md:px-10 shadow-md">
        <div>
          <p className="text-gray-500 font-semibold text-2xl">Job Post</p>

          <form
            className="w-full mt-2 flex flex-col gap-8"
            onSubmit={handleSubmit(onSubmit)}
          >
            <TextInput
              name="jobTitle"
              label="Job Title"
              placeholder="eg. Driver at Company X"
              type="text"
              required={true}
              register={register("jobTitle", {
                required: "Job Title is required",
              })}
              error={errors.jobTitle ? errors.jobTitle?.message : ""}
            />

            <div className="w-full flex gap-4">
              <div className={`w-1/2 mt-2`}>
                <label className="text-gray-600 text-sm mb-1">Job Type</label>
                <JobTypes jobType={jobType} setJobType={setJobType} />
              </div>

              <div className="w-1/2">
                <TextInput
                  name="salary"
                  label="Salary (Rwf)"
                  placeholder="eg. 150000"
                  type="number"
                  register={register("salary", {
                    required: "Salary is required",
                  })}
                  error={errors.salary ? errors.salary?.message : ""}
                />
              </div>
            </div>

            <div className="w-full">
              <TextInput
                name="experience"
                label="Years of Experience"
                placeholder="experience"
                type="number"
                register={register("experience", {
                  required: "Experience is required",
                })}
                error={errors.experience ? errors.experience?.message : ""}
              />
            </div>

            <TextInput
              name="location"
              label="Job Location"
              placeholder="eg. Kigali Rwanda"
              type="text"
              register={register("location", {
                required: "Job Location is required",
              })}
              error={errors.location ? errors.location?.message : ""}
            />
            <div className="flex flex-col">
              <label className="text-gray-600 text-sm mb-1">
                Job Description
              </label>
              <textarea
                className="rounded border border-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-base px-4 py-2 resize-none"
                rows={4}
                cols={6}
                {...register("desc", {
                  required: "Job Description is required!",
                })}
                aria-invalid={errors.desc ? "true" : "false"}
              ></textarea>
              {errors.desc && (
                <span role="alert" className="text-xs text-red-500 mt-0.5">
                  {errors.desc?.message}
                </span>
              )}
            </div>

            <div className="flex flex-col">
              <label className="text-gray-600 text-sm mb-1">
                Core Requirements
              </label>
              <textarea
                className="rounded border border-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-base px-4 py-2 resize-none"
                rows={4}
                cols={6}
                {...register("requirements")}
              ></textarea>
            </div>

            {errMsg && (
              <span role="alert" className="text-sm text-red-500 mt-0.5">
                {errMsg}
              </span>
            )}
            <div className="mt-2">
              <CustomButton
                type="submit"
                containerStyles="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-8 py-2 text-sm font-medium text-white hover:bg-[#1d4fd846] hover:text-[#1d4fd8] focus:outline-none "
                title="Sumbit"
              />
            </div>
          </form>
        </div>
      </div>
      <div className="w-full md:w-1/3 2xl:2/4 p-5 mt-20 md:mt-0">
        <p className="text-gray-500 font-semibold py-5">Recent Job Post</p>

        <div className="w-full flex flex-wrap gap-4">
          {loading && <Loading />}
          {!loading &&
            jobs
              ?.slice(0, 3)
              .map((job, index) => <JobCard job={job} key={index} />)}
        </div>
      </div>
    </div>
  );
};

export default UploadJob;
