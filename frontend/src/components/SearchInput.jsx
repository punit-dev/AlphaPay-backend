import React from "react";
import { FaSearch } from "react-icons/fa";

const SearchInput = () => {
  return (
    <div
      id="ap-search-container"
      className="w-full h-14 bg-[#161B26] border-2 border-[#2C3546] rounded-full mt-4 flex items-center p-3 gap-3">
      <FaSearch className="text-white h-7 w-7" />
      <input
        id="ap-search"
        name="search"
        type="text"
        className="w-full h-full text-white outline-none placeholder:text-[#707A89] text-xl font-urbanist"
        placeholder="Search..."
      />
    </div>
  );
};

export default SearchInput;
