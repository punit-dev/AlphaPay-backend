import { useSelector } from "react-redux";
import Nav from "../components/Nav";
import { useEffect, useRef } from "react";
import QRCodeStyling from "qr-code-styling";
import Button from "../components/Button";
import { RiShare2Line } from "react-icons/ri";

const qrCode = new QRCodeStyling({
  width: 280,
  height: 280,
  type: "svg",
  dotsOptions: {
    color: "#ffffff",
    type: "rounded",
  },
  backgroundOptions: {
    color: "#0B0F1A",
  },
  cornersSquareOptions: {
    type: "extra-rounded",
  },
  qrOptions: {
    errorCorrectionLevel: "H",
  },
});

const Home = () => {
  const { user } = useSelector((state) => state.auth);
  const canvasRef = useRef(null);

  useEffect(() => {
    qrCode.update({ data: user.upiId });
    qrCode.append(canvasRef.current);
  }, [user.upiId]);

  return (
    <div className="h-screen relative w-full  bg-linear-160 from-[#A27EFF58] from-0% via-transparent via-50% to-[#00AFFF58] to-100%">
      <Nav profilePic={user.profilePic} />
      <h2 className="text-center text-3xl font-urbanist font-semibold text-white mt-3 z-10">
        Scan to pay
      </h2>
      <div id="ap-qr-code" className="mt-7">
        <div className="flex gap-3 items-center justify-center">
          <div className="overflow-hidden h-12 w-12 rounded-full bg-white">
            <img src={user.profilePic} alt="profile" />
          </div>
          <div>
            <h3 className="text-[#B0B8C3] font-lexend font-medium text-[18px]">
              {user.fullname}
            </h3>
            <h4 className="text-white font-urbanist font-semibold">
              {user.upiId}
            </h4>
          </div>
        </div>
        <div className="flex w-full items-center justify-center mt-7 ">
          <div
            ref={canvasRef}
            className="h-75 w-75 bg-[#0B0F1A] flex items-center justify-center rounded-4xl"></div>
        </div>
        <Button
          id={"ap-share-button"}
          text="Share QR"
          color="bg-linear-60 from-[#00AFFF] to-[#A27EFF]"
          className={
            "max-w-45 rounded-2xl flex text-2xl items-center justify-center gap-3 mx-auto mt-5"
          }
          children={<RiShare2Line />}
        />
      </div>
      <div className="h-[calc(100vh-88px)] w-full bg-[#ffffff20] backdrop-blur-sm absolute top-22 rounded-t-3xl">
        <div className="mx-auto w-30 h-1.5 rounded-full bg-black mt-3"></div>
      </div>
    </div>
  );
};

export default Home;
