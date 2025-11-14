import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Input = ({
  label = "default",
  placeholder = "default",
  fontsize = "text-lg",
  type = "text",
  value = "",
  required = false,
  onChange = () => {},
  name,
  minLength = 3,
}) => {
  const [isShow, setIsShow] = useState(false);
  return (
    <div
      id="ap-input-field"
      className={`font-urbanist ${fontsize} font-medium flex flex-col gap-1`}>
      <label htmlFor={name} className="text-white">
        {label}
      </label>
      <div className="flex items-center gap-3 text-white bg-[#2C3546] px-3 py-2 w-full rounded-xl">
        <input
          value={value}
          onChange={onChange}
          type={type == "password" && isShow ? "text" : type}
          className="outline-none placeholder:text-[#707A89] w-full"
          placeholder={placeholder}
          required={required}
          name={name}
          id={name}
          autoComplete="off"
          minLength={minLength}
        />
        {type == "password" ? (
          isShow ? (
            <FaEye
              onClick={() => setIsShow((prev) => !prev)}
              className="cursor-pointer"
            />
          ) : (
            <FaEyeSlash
              onClick={() => setIsShow((prev) => !prev)}
              className="cursor-pointer"
            />
          )
        ) : null}
      </div>
    </div>
  );
};

export default Input;
