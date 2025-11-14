import React from "react";

const ParentFormDiv = ({
  children,
  minHeight = "min-h-60",
  maxHeight = "max-h-110",
  padding = "p-3",
  displayProp = "flex flex-col gap-5 justify-center items-center",
  formHandling = (e) => {
    e.preventDefault();
  },
  margin = "mt-20",
  id,
}) => {
  return (
    <div
      id="ap-parent-form-div"
      className={`min-w-80 ${minHeight} ${maxHeight} p-0.5 rounded-2xl bg-linear-to-br from-[#00AFFF] to-[#A27EFF] ${margin} font-urbanist font-medium overflow-auto`}>
      <form
        id={id}
        onSubmit={formHandling}
        className={`${padding} h-auto min-h-60 max-h-97 w-full bg-[#161B26] rounded-2xl text-white ${displayProp} overflow-auto`}>
        {children || "Default"}
      </form>
    </div>
  );
};

export default ParentFormDiv;
