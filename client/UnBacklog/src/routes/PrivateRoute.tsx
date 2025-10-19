import { useContext, type ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

interface PrivateRouteProps {
  children: ReactNode;
}


export const PrivateRoute = ({ children } : PrivateRouteProps)  => {
  const { user , loading } = useContext(AuthContext);

  if (loading) return <p>Carregando...</p>;
  if (!user) return <Navigate to="/login" replace />;

  return children;
};
