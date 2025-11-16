import { useSelector, useDispatch } from "react-redux";
import Nav from "../components/Nav";
import { useEffect, useRef, useState } from "react";
import QRCodeStyling from "qr-code-styling";
import Button from "../components/Button";
import { RiShare2Line } from "react-icons/ri";
import { motion, useAnimation } from "motion/react";
import SearchInput from "../components/SearchInput";
import { logout } from "../redux/authSlice";
import { useNavigate } from "react-router";
import Loading from "./Loading";

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
  const { user, loading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const qrRef = useRef(null);
  const [isSwiped, setIsSwiped] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    qrCode.update({ data: user.upiId });
    qrCode.append(qrRef.current);
  }, [user.upiId]);

  const controls = useAnimation();
  const sheetHeight = 550;

  const handleDragEnd = (e, info) => {
    const { velocity, point } = info;

    if (velocity.y > 100 || point.y > sheetHeight / 2) {
      controls.start({
        y: sheetHeight,
        transition: { type: "tween", stiffness: 200 },
      });
      setIsSwiped(true);
    } else {
      controls.start({ y: 0, transition: { type: "tween", stiffness: 200 } });
      setIsSwiped(false);
    }
  };

  const logoutCall = async () => {
    const res = await dispatch(logout());

    if (logout.fulfilled.match(res)) {
      navigate("/authentication");
    }
  };

  return (
    <div
      id="ap-home"
      className="h-screen relative w-full overflow-hidden bg-linear-160 from-[#A27EFF58] from-0% via-transparent via-50% to-[#00AFFF58] to-100%">
      <Nav profilePic={user.profilePic} />
      <motion.h2
        initial={{
          translateY: "150px",
        }}
        animate={{
          translateY: isSwiped ? 0 : "150px",
        }}
        transition={{
          type: "tween",
        }}
        className="text-center text-3xl font-urbanist font-semibold text-white mt-3">
        Scan to pay
      </motion.h2>
      <div id="ap-qr-code" className="mt-7">
        <motion.div
          initial={{ translateY: "80px" }}
          animate={{
            translateY: isSwiped ? 0 : "80px",
          }}
          className="flex gap-3 items-center justify-center">
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
        </motion.div>
        <div className="flex w-full items-center justify-center mt-7 relative z-1">
          <div
            ref={qrRef}
            className="h-75 w-75 bg-[#0B0F1A] flex items-center justify-center rounded-4xl"></div>
        </div>
      </div>
      <motion.div
        id="ap-menu"
        drag="y"
        dragConstraints={{ top: 0, bottom: sheetHeight }}
        dragElastic={0.05}
        dragMomentum={false}
        onDragEnd={handleDragEnd}
        animate={controls}
        className="h-[calc(100vh+10px)] w-full bg-[#ffffff20] backdrop-blur-sm absolute top-22 rounded-t-3xl z-10 px-6">
        <div className="mx-auto w-30 h-1.5 rounded-full bg-black mt-3"></div>
        <SearchInput />
        <Button text="Log out" onclick={logoutCall} />
      </motion.div>
      {loading ? <Loading /> : null}
    </div>
  );
};

export default Home;
