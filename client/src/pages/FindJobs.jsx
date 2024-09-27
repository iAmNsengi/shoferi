import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { BiBriefcaseAlt2 } from "react-icons/bi";
import { BsStars } from "react-icons/bs";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import Header from "../components/Header";
import { experience, jobTypes } from "../utils/data";
import { CustomButton, JobCard, ListBox, Loading } from "../components";
import { useJobs } from "../hooks/useJobs";

const FindJobs = () => {
  const [sort, setSort] = useState("Newest");
  const [page, setPage] = useState(1);
  const [numPage, setNumPage] = useState(1);
  const [recordCount, setRecordCount] = useState(0);
  const [data, setData] = useState([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [jobLocation, setJobLocation] = useState("");
  const [filterJobTypes, setFilterJobTypes] = useState([]);
  const [filterExp, setFilterExp] = useState([]);

  const [isFetching, setIsFetching] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const { jobs, loading, error, getJobs } = useJobs();

  useEffect(() => {
    getJobs(); // Fetch jobs on component mount
  }, []);

  useEffect(() => {
    let filteredJobs = [...jobs]; // Create a copy of jobs to avoid mutating the original array

    // Filter by search query (job title or location)
    if (searchQuery)
      filteredJobs = filteredJobs.filter(
        (job) =>
          job.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
          job.location.toLowerCase().includes(searchQuery.toLowerCase())
      );

    // Filter by selected job types (if any)
    if (filterJobTypes.length > 0)
      filteredJobs = filteredJobs.filter((job) =>
        filterJobTypes.includes(job.jobType)
      );

    // Sort jobs
    if (sort === "Newest")
      filteredJobs.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
    else if (sort === "Oldest")
      filteredJobs.sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
      );
    else if (sort === "A-Z")
      filteredJobs.sort((a, b) => a.jobTitle.localeCompare(b.jobTitle));
    // Sort alphabetically by jobTitle (A-Z)
    else if (sort === "Z-A")
      filteredJobs.sort((a, b) => b.jobTitle.localeCompare(a.jobTitle)); // Sort alphabetically by jobTitle (Z-A)

    // Set the filtered and sorted data
    setData(filteredJobs);
  }, [jobs, sort, searchQuery, jobLocation, filterJobTypes, filterExp]);

  const filterJobs = (val) => {
    if (filterJobTypes.includes(val))
      setFilterJobTypes(filterJobTypes.filter((el) => el !== val));
    else setFilterJobTypes([...filterJobTypes, val]);
  };
  const filterExperience = (val) => {
    if (filterExp.includes(val))
      setFilterExp(filterExp.filter((el) => el !== val));
    else setFilterExp([...filterExp, val]);
  };

  return (
    <div>
      <Header
        title="Search driver's job in Rwanda"
        type="home"
        placeholder={"Search job title or location..."}
        handleClick={() => {}}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        location={jobLocation}
        setLocation={setJobLocation}
      />

      <div className="container mx-auto flex gap-6 2xl:gap-10 md:px-5 py-0 md:py-6 bg-[#f7fdfd]">
        <div className="hidden md:flex flex-col w-1/6 h-fit bg-white shadow-sm">
          <p className="text-lg font-semibold text-slate-600">Filter Search</p>

          <div className="py-2">
            <div className="flex justify-between mb-3">
              <p className="flex items-center gap-2 font-semibold">
                <BiBriefcaseAlt2 />
                Job Type
              </p>

              <button>
                <MdOutlineKeyboardArrowDown />
              </button>
            </div>

            <div className="flex flex-col gap-2">
              {jobTypes.map((jtype, index) => (
                <div key={index} className="flex gap-2 text-sm md:text-base ">
                  <input
                    type="checkbox"
                    value={jtype}
                    className="w-4 h-4"
                    onChange={(e) => filterJobs(e.target.value)}
                  />
                  <span>{jtype}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="py-2 mt-4">
            <div className="flex justify-between mb-3">
              <p className="flex items-center gap-2 font-semibold">
                <BsStars />
                Experience
              </p>

              <button>
                <MdOutlineKeyboardArrowDown />
              </button>
            </div>

            <div className="flex flex-col gap-2">
              {experience.map((exp) => (
                <div key={exp.title} className="flex gap-3">
                  <input
                    type="checkbox"
                    value={exp?.value}
                    className="w-4 h-4"
                    onChange={(e) => filterExperience(e.target.value)}
                  />
                  <span>{exp.title}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="w-full md:w-5/6 px-5 md:px-0">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm md:text-base">
              Showing: <span className="font-semibold">({data.length})</span>{" "}
              Jobs Available
            </p>

            <div className="flex flex-col md:flex-row gap-0 md:gap-2 md:items-center">
              <p className="text-sm md:text-base">Sort By:</p>

              <ListBox sort={sort} setSort={setSort} />
            </div>
          </div>

          <div className="w-full flex flex-wrap gap-4">
            {loading && <Loading />}
            {data.map((job, index) => (
              <JobCard job={job} key={index} />
            ))}
          </div>

          {numPage > page && !isFetching && (
            <div className="w-full flex items-center justify-center pt-16">
              <CustomButton
                title="Load More"
                containerStyles={`text-blue-600 py-1.5 px-5 focus:outline-none hover:bg-blue-700 hover:text-white rounded-full text-base border border-blue-600`}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FindJobs;
