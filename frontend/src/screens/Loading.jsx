const Loading = () => {
  return (
    <div className="h-screen w-full flex justify-center items-center bg-[#0000008d] backdrop-blur-md absolute top-0 left-0 z-10">
      <div className="h-10 w-10 rounded-full border-2 border-x-white border-t-white animate-spin"></div>
    </div>
  );
};

export default Loading;
