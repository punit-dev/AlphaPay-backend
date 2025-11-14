import Auth from "./screens/Auth";
import { Routes, Route } from "react-router";
import Home from "./screens/Home";
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
  return (
    <div className="bg-[#0B0F1A]">
      <Routes>
        <Route path="/authentication" element={<Auth />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
};

export default App;
