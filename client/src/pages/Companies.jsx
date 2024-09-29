import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  CompanyCard,
  CustomButton,
  Header,
  ListBox,
  Loading,
} from "../components";
import { useCompanies } from "../hooks/useCompanies";
import Notification from "../components/Notification";

const Companies = () => {
  const [page, setPage] = useState(1);
  const [numPage, setNumPage] = useState(1);
  const [recordsCount, setRecordsCount] = useState(0);
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [cmpLocation, setCmpLocation] = useState("");
  const [sort, setSort] = useState("Newest");
  const [isFetching, setIsFetching] = useState(false);

  const { companies, loading, error, getCompanies } = useCompanies();

  const location = useLocation();
  const navigate = useNavigate();

  const handleSearchSubmit = () => {};
  const handleShowMore = () => {};

  useEffect(() => {
    getCompanies();
  }, []);

  useEffect(() => {
    let filteredCompanies = [...companies];

    // Filter by search query (company name)
    if (searchQuery) {
      filteredCompanies = filteredCompanies.filter((company) =>
        company.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    // Sort jobs
    if (sort === "Newest") {
      filteredCompanies.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
    } else if (sort === "Oldest") {
      filteredCompanies.sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
      );
    } else if (sort === "A-Z") {
      filteredCompanies.sort((a, b) => a.name.localeCompare(b.name)); // Sort alphabetically by name (A-Z)
    } else if (sort === "Z-A") {
      filteredCompanies.sort((a, b) => b.name.localeCompare(a.name)); // Sort alphabetically by name (Z-A)
    }
    setData(filteredCompanies);
  }, [companies, sort, searchQuery]);

  return (
    <div className="w-full">
      <Header
        title="Access all companies"
        handleClick={handleSearchSubmit}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        location={cmpLocation}
        setLocation={setSearchQuery}
        placeholder={"Search company name..."}
      />

      <div className="container mx-auto flex flex-col gap-5 2xl:gap-10 px-5 md:px-0 py-6 bg-[#f7fdfd]">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm md:text-base">
            Showing: <span className="font-semibold">{data.length} </span>{" "}
            Companies Available
          </p>

          <div className="flex flex-col md:flex-row gap-0 md:gap-2 md:items-center">
            <p className="text-sm md:text-base">Sort By:</p>
            <ListBox sort={sort} setSort={setSort} />
          </div>
        </div>

        <div className="w-full flex flex-col gap-6">
          {loading && <Loading />}
          {error && (
            <Notification message="Error fetching companies details. Try again later!" />
          )}
          <div className="flex flex-wrap gap-4">
            {data?.map((cmp, index) => (
              <CompanyCard cmp={cmp} key={index} />
            ))}
          </div>
          {!loading && !data.length && <Notification />}

          <p className="text-sm text-right">
            {data?.length} records out of {recordsCount}
          </p>
        </div>

        {numPage > page && !isFetching && (
          <div className="w-full flex items-center justify-center pt-16">
            <CustomButton
              onClick={handleShowMore}
              title="Load More"
              containerStyles={`text-blue-600 py-1.5 px-5 focus:outline-none hover:bg-blue-700 hover:text-white rounded-full text-base border border-blue-600`}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Companies;
