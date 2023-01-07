import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

export const PrivateRoute = () => {
  const isLoggedIn = useSelector((state) => state.auth?.isLoggedIn);
  return isLoggedIn ? <Outlet /> : <Navigate to="/login" replace />;
};
