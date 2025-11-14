import React from "react";
import { IoNotifications } from "react-icons/io5";

const Nav = ({ profilePic }) => {
  return (
    <nav className="w-full p-3 flex justify-between items-center bg-transparent backdrop-blur-md">
      <div className="overflow-hidden h-12 w-12 rounded-full bg-white">
        <img src={profilePic} alt="profile" />
      </div>
      <h1 className="text-transparent bg-clip-text bg-linear-120 from-[#00AFFF] from-6% to-[#A27EFF] to-92% font-space_grotesk text-4xl font-extrabold">
        AlphaPay
      </h1>
      <IoNotifications className="h-8 w-8 text-white" />
    </nav>
  );
};

export default Nav;
