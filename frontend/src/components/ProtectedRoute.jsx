import { Navigate } from "react-router";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ children }) => {
  const { user } = useSelector((state) => state.auth);

  return user ? children : <Navigate to={"/authentication"} />;
};

export default ProtectedRoute;
