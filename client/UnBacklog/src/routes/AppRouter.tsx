import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PrivateRoute } from "./PrivateRoute";

import LoginPage from "../pages/LoginPage/LoginPage"
import RegisterPage from "../pages/RegisterPage/RegisterPage"

export const AppRouter = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      
      <Route
        path="/"
        element={
          <PrivateRoute>
            < >
            </>
          </PrivateRoute>
        }
      />
    </Routes>
  </BrowserRouter>
);
