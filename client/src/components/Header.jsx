import React from "react";
import { AiOutlineSearch, AiOutlineCloseCircle } from "react-icons/ai";
import CustomButton from "./CustomButton";
import { popularSearch } from "../utils/data";

const SearchInput = ({ placeholder, icon, value, setValue, styles }) => {
  const handleChange = (e) => {
    setValue(e.target.value);
  };

  const clearInput = () => setValue("");

  return (
    <div
      className={`flex w-full md:w-1/3 items-center justify-between border rounded-full px-2 ${styles}`}
    >
      {icon}

      <input
        value={value}
        onChange={(e) => handleChange(e)}
        type="text"
        className="w-full md:w-80 p-2 outline-none bg-transparent text-base"
        placeholder={placeholder}
      />

      <AiOutlineCloseCircle
        className="hidden md:flex text-gray-600 text-xl cursor-pointer"
        onClick={clearInput}
      />
    </div>
  );
};

const Header = ({
  title,
  type,
  handleClick,
  searchQuery,
  setSearchQuery,
  location,
  setLocation,
}) => {
  return (
    <div className="bg-[#f7fdfd]">
      <div
        className={`container mx-auto px-5 ${
          type ? "h-[500px]" : "h-[350px]"
        } flex items-center relative`}
      >
        <div className="w-full z-10">
          <div className="mb-8">
            <p className="text-slate-700 font-bold text-4xl text-center">
              {title}
            </p>
          </div>

          <div className="w-full flex items-center justify-center bg-white px-2 md:px-5 py-2.5 md:py-6 shadow-2xl rounded-full">
            <SearchInput
              placeholder="Job title or location..."
              icon={<AiOutlineSearch className="text-gray-600 text-xl" />}
              value={searchQuery}
              setValue={setSearchQuery}
            />

            <div>
              <CustomButton
                onClick={handleClick}
                title="Search"
                containerStyles={
                  "text-white py-2 md:py3 px-3 md:px-10 focus:outline-none bg-orange-600 rounded-full border hover:bg-transparent hover:border-orange-600 hover:text-orange-600 text-sm md:text-base"
                }
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
