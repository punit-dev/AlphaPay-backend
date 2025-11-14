const Divider = ({ fontsize = "text-md" }) => {
  return (
    <div
      className={`w-full h-fit ${fontsize} flex justify-between gap-2 items-center`}>
      <div className="h-px w-full bg-[#2C3546] rounded-full"></div>
      <p className="text-[#707A89] font-lexend">OR</p>
      <div className="h-px w-full bg-[#2C3546] rounded-full"></div>
    </div>
  );
};

export default Divider;
