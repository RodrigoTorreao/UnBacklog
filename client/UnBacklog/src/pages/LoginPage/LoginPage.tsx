import React, { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Header } from "../../components/Header";
import { TextField, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";


import "./LoginPage.css"


const LoginPage: React.FC = () => {
  const { handleLogin, loading } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await handleLogin(email, password);
      navigate("/"); 
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      alert("Falha no login. Verifique suas credenciais.");
    } 
  };

  return (
    <div style={{ fontFamily: 'Inter, "Noto Sans", sans-serif' }}>
      <Header />
      <div className="main">
        <h1 className="text-center">
          Bem-Vindo ao UnBacklog! 
        </h1>
        <div className="input-container">
          <TextField
            placeholder="Email"  
            fullWidth
            variant="outlined"
            className="custom-input"
            onChange={(event) => setEmail(event.target.value)}
            value={email}
          />
          <TextField
            placeholder="Senha"  
            fullWidth
            variant="outlined"
            className="custom-input"
            onChange={(event) => setPassword(event.target.value)}
            value={password}
            type="password"

          />
          <Button variant="contained" className="custom-button" onClick={handleSubmit}>
            Login
          </Button>
        </div>
          <div>
            <p>
              Não possui conta?{" "}
              <span 
                style={{ color: "#006633", cursor: "pointer", fontWeight: "bold" }}
                onClick={() => navigate("/register")}
              >
                Registrar
              </span>
            </p>
          </div>
      </div>
      <div>

      </div>

      
    </div>
  );
};

export default LoginPage;
