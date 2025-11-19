import React from "react";

const Block = ({ children, className }) => {
  return (
    <div className={`w-full min-h-30 rounded-2xl bg-[#0B0F1A] ${className}`}>
      {children}
    </div>
  );
};

export default Block;
