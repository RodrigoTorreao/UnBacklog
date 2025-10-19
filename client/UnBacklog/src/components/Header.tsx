import React from "react";
import Logo from "../assets/logo.svg";
import "../styles/Header.css"

export const Header: React.FC = () => {
  return (
    <header className="header">
      <div className="header-left">
        <img src={Logo} alt="Logo UnBacklog" className="header-logo" />
        <h2 className="header-title">UnBacklog</h2>
      </div>
    </header>
  );
};
