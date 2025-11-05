import React from "react";
import Logo from "../assets/logo.svg";
import "../styles/Header.css"
import { useNavigate } from "react-router-dom";

export const Header: React.FC = () => {
  const navigate = useNavigate();
  return (
    <header className="header">
      <div className="header-left"style={{cursor: "pointer"}} onClick={() => navigate("/")}>
        <img src={Logo} alt="Logo UnBacklog" className="header-logo" />
        <h2 className="header-title">UnBacklog</h2>
      </div>
    </header>
  );
};
