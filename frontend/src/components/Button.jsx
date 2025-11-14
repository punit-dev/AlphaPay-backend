import React from "react";
import { motion } from "motion/react";

const Button = ({
  text = "Default",
  color = "bg-[#A27EFF]",
  fontsize = "text-2xl",
  onclick = (e) => {
    console.log(e.target.innerText);
  },
  id,
  className,
  children,
}) => {
  return (
    <motion.button
      whileTap={{
        scale: "0.9px",
      }}
      id={id}
      onClick={onclick}
      className={`w-full ${color} py-2 ${fontsize} font-manrope font-semibold ${className}`}>
      {text}
      {children}
    </motion.button>
  );
};

export default Button;
