import { AiOutlineCloseCircle } from "react-icons/ai";

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

export default SearchInput;
