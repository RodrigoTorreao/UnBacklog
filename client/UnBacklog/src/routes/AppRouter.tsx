import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PrivateRoute } from "./PrivateRoute";

import LoginPage from "../pages/LoginPage/LoginPage"
import RegisterPage from "../pages/RegisterPage/RegisterPage"
import HomePage from "../pages/HomePage/HomePage";
import NewProject from "../pages/NewProjectPage/NewProject";
import { ProjectProvider } from "../context/ProjectContext";
import ProjectPage from "../pages/ProjectPage/ProjectPage";

export const AppRouter = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      
      <Route
        path="/"
        element={
          <PrivateRoute>
            <ProjectProvider>
              <HomePage/>
            </ProjectProvider>
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
      <Route
        path="/project"
        element={
          <PrivateRoute>
            <ProjectProvider>
              <ProjectPage/>
            </ProjectProvider>
          </PrivateRoute>
        }
      />
    </Routes>
  </BrowserRouter>
);
