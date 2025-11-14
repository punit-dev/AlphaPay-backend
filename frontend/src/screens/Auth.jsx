import Logo from "../components/Logo";
import ParentFormDiv from "../components/ParentFormDiv";
import Button from "../components/Button";
import Divider from "../components/Divider";
import Input from "../components/Input";
import { useState } from "react";
import { motion } from "motion/react";

import { useDispatch, useSelector } from "react-redux";
import { login, signup, verifyOtp, resendOtp } from "../redux/authSlice";
import { useNavigate } from "react-router";
import Loading from "./Loading";

const Auth = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [translateX, setTranslateX] = useState("-25%");

  const [signupFullname, setSignupFullname] = useState("");
  const [signupPhNo, setSignupPhNo] = useState("");
  const [signupDob, setSignupDob] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupConfirmPassword, setSignupConfirmPassword] = useState("");
  const [signupUsername, setSignupUsername] = useState("");

  const [verificationOTP, setVerificationOTP] = useState("");

  const { loading, error, otp } = useSelector((state) => state.auth);

  const loginCall = async (e) => {
    e.preventDefault();
    const res = await dispatch(
      login({ data: loginUsername, password: loginPassword })
    );

    if (login.fulfilled.match(res)) {
      setLoginUsername("");
      setLoginPassword("");
      navigate("/");
    }
  };
  const signupCall = async (e) => {
    e.preventDefault();
    const res = await dispatch(
      signup({
        username: signupUsername,
        email: signupEmail,
        fullname: signupFullname,
        dateOfBirth: signupDob,
        phoneNumber: signupPhNo,
        password: signupPassword,
      })
    );

    if (signup.fulfilled.match(res)) {
      setTranslateX("-75%");
      setSignupConfirmPassword("");
      setSignupDob("");
      setSignupEmail("");
      setSignupFullname("");
      setSignupPassword("");
      setSignupPhNo("");
      setSignupUsername("");
    }
  };

  const verifyOtpCall = async (e) => {
    e.preventDefault();
    const res = await dispatch(
      verifyOtp({ otp: verificationOTP, email: signupEmail })
    );

    if (verifyOtp.fulfilled.match(res)) {
      navigate("/");
      setVerificationOTP("");
    }
  };

  const resendOtpCall = async (e) => {
    e.preventDefault();
    const res = await dispatch(resendOtp(signupEmail));

    if (resendOtp.fulfilled.match(res)) {
      console.log("its is send");
    }
  };

  const inputHandling = (setMethod) => {
    return (e) => {
      setMethod(e.target.value);
    };
  };

  return (
    <div
      id="ap-auth"
      className="h-screen w-full bg-linear-120 from-[#a37eff34] from-0% via-transparent via-60% to-[#00aeff34] to-92% pt-20 overflow-hidden">
      <Logo />
      <motion.div
        initial={{
          translateX: "-25%",
        }}
        animate={{
          translateX: translateX,
        }}
        transition={{
          duration: 0.4,
          type: "tween",
        }}
        id="ap-auth-parent"
        className="h-auto min-h-60 w-360 overflow-hidden px-5 flex gap-10 items-center">
        {/* Login form */}
        <ParentFormDiv
          margin="mt-10"
          displayProp="block shrink-0"
          padding="px-10 py-10"
          id={"ap-login-form"}
          formHandling={loginCall}>
          <h2 className="text-3xl font-medium text-center -mt-3">Log in</h2>
          <p className="text-base text-rose-600 text-center">{error}</p>
          <div className="mt-5 flex flex-col gap-5">
            <Input
              key="ap-loginUsername"
              label="Username"
              placeholder="john123"
              fontsize="text-md"
              value={loginUsername}
              type="text"
              onChange={inputHandling(setLoginUsername)}
              name={"login-username"}
              required={true}
            />
            <div>
              <Input
                key="ap-loginPassword"
                label="Password"
                placeholder="password"
                fontsize="text-md"
                value={loginPassword}
                type="password"
                onChange={inputHandling(setLoginPassword)}
                name={"login-password"}
                required={true}
                minLength={8}
              />
              <p className="text-sm text-[#009FE7] font-lexend font-medium mt-1">
                Forgot password?
              </p>
            </div>
            <div>
              <Button
                text="Log in"
                fontsize="text-xl"
                color="bg-[#00AFFF]"
                hover="hover:bg-[#5AC8FA]"
                id={"ap-login-button"}
              />
              <p className="text-sm font-lexend font-medium mt-1">
                Don’t have any account?{" "}
                <span
                  className="text-[#009FE7]"
                  onClick={() => {
                    setTranslateX("-50%");
                  }}>
                  Sign up
                </span>
              </p>
            </div>
          </div>
        </ParentFormDiv>
        {/* Default screen */}
        <ParentFormDiv displayProp="block shrink-0" id={"ap-path"}>
          <div className="w-full h-full my-5 flex flex-col gap-3 items-center">
            <p className="text-center text-xl">
              Your wallet, now in your pocket
            </p>
            <div className="h-2"></div>
            <Button
              text="Log in"
              fontsize="text-xl"
              color="bg-[#00AFFF]"
              hover="hover:bg-[#5AC8FA]"
              onclick={(e) => {
                setTranslateX("0");
              }}
            />
            <Divider />
            <Button
              text="Sign up"
              fontsize="text-xl"
              onclick={(e) => {
                setTranslateX("-50%");
              }}
            />
          </div>
        </ParentFormDiv>
        {/* Signup form */}
        <ParentFormDiv
          margin="mt-10"
          displayProp="block shrink-0"
          padding="px-10 py-10"
          maxHeight="max-h-100"
          id={"ap-signup-form"}
          formHandling={signupCall}>
          <h2 className="text-2xl font-medium text-center -mt-3">
            Create an account
          </h2>
          <p className="text-base text-rose-600 text-center">{error}</p>
          <p className="text-sm font-lexend font-medium mt-4">
            Already have an account?{" "}
            <span
              className="text-[#009FE7]"
              onClick={() => {
                setTranslateX("0");
              }}>
              Login
            </span>
          </p>
          <div className="mt-5 flex flex-col gap-5">
            <Input
              key="ap-signup-fullname"
              label="Fullname"
              placeholder="John Smith"
              fontsize="text-md"
              value={signupFullname}
              type="text"
              onChange={inputHandling(setSignupFullname)}
              required={true}
              name={"signup-fullname"}
            />
            <Input
              key="ap-signup-phone-number"
              label="Phone Number"
              placeholder="1234567890"
              fontsize="text-md"
              value={signupPhNo}
              type="number"
              onChange={inputHandling(setSignupPhNo)}
              required={true}
              name={"signup-phone-number"}
              minLength={10}
            />
            <Input
              key="ap-signup-dob"
              label="Date of birth"
              placeholder="DD-MM-YYYY"
              fontsize="text-md"
              value={signupDob}
              type="date"
              onChange={inputHandling(setSignupDob)}
              required={true}
              name={"signup-dob"}
            />
            <Input
              key="ap-signup-username"
              label="Username"
              placeholder="john123"
              fontsize="text-md"
              value={signupUsername}
              type="text"
              onChange={inputHandling(setSignupUsername)}
              required={true}
              name={"signup-username"}
            />
            <Input
              key="ap-signup-email"
              label="Email"
              placeholder="john@gmail.com"
              fontsize="text-md"
              value={signupEmail}
              type="email"
              onChange={inputHandling(setSignupEmail)}
              required={true}
              name={"signup-email"}
            />
            <Input
              key="ap-signup-password"
              label="Password"
              placeholder="Password"
              fontsize="text-md"
              value={signupPassword}
              type="password"
              onChange={inputHandling(setSignupPassword)}
              required={true}
              name={"signup-password"}
              minLength={8}
            />
            <Input
              key="ap-signup-confirm-password"
              label="Confirm Password"
              placeholder="Password"
              fontsize="text-md"
              value={signupConfirmPassword}
              type="password"
              onChange={inputHandling(setSignupConfirmPassword)}
              required={true}
              name={"signup-confirm-password"}
              minLength={8}
            />
            <Button
              text={"Create account"}
              fontsize="text-xl"
              color="bg-[#00AFFF]"
              hover="hover:bg-[#5AC8FA]"
              id={"ap-signup-button"}
            />
          </div>
        </ParentFormDiv>
        {/* OTP verification form */}
        <ParentFormDiv
          margin="mt-10"
          displayProp="block shrink-0"
          padding="px-10 py-10"
          maxHeight="max-h-100"
          id={"ap-verify-form"}
          formHandling={verifyOtpCall}>
          <h2 className="text-2xl font-medium text-center -mt-3">
            Verify your email
          </h2>
          <p className="text-sm font-lexend font-medium mt-4">
            please enter 6 digit code sent to {`${signupEmail}\n`} (No email OTP
            (Demo project). Use this OTP to verify: {otp})
          </p>
          <div className="mt-5 flex flex-col gap-5">
            <Input
              key="ap-verify-otp"
              label=""
              placeholder="OTP"
              fontsize="text-md"
              value={verificationOTP}
              type="number"
              onChange={inputHandling(setVerificationOTP)}
              required={true}
              name={"verify-otp"}
              minLength={6}
            />

            <Button
              text="Verify OTP"
              fontsize="text-xl"
              color="bg-[#00AFFF]"
              hover="hover:bg-[#5AC8FA]"
              id={"ap-verify-button"}
            />
            <div
              id="ap-resend-otp"
              className="text-xl text-white text-center"
              onClick={resendOtpCall}>
              <p>Resend OTP</p>
            </div>
          </div>
        </ParentFormDiv>
      </motion.div>
      {loading ? <Loading /> : null}
    </div>
  );
};

export default Auth;
