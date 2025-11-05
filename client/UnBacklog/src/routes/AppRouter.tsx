import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PrivateRoute } from "./PrivateRoute";

import LoginPage from "../pages/LoginPage/LoginPage"
import RegisterPage from "../pages/RegisterPage/RegisterPage"
import HomePage from "../pages/HomePage/HomePage";
import NewProject from "../pages/NewProjectPage/NewProject";

export const AppRouter = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      
      <Route
        path="/"
        element={
          <PrivateRoute>
            <HomePage/>
          </PrivateRoute>
        }
      />
      <Route
        path="/new-project"
        element={
          <PrivateRoute>
            <NewProject/>
          </PrivateRoute>
        }
      />
    </Routes>
  </BrowserRouter>
);
