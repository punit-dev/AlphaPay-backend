import logo from "../assets/logo.svg";

const Logo = ({ className }) => {
  return (
    <div
      id="ap-logo-div"
      className={`flex flex-col items-center justify-center ${className} relative`}>
      <img id="ap-logo-svg" src={logo} className="h-35 w-35" />
      <h1
        id="ap-logo-heading"
        className="text-transparent bg-clip-text bg-linear-120 from-[#00AFFF] from-6% to-[#A27EFF] to-92% font-space_grotesk text-4xl font-extrabold">
        AlphaPay
      </h1>
    </div>
  );
};

export default Logo;
