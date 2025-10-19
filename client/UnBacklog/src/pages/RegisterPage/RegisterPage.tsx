import React, { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Header } from "../../components/Header";
import { TextField, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

import "./RegisterPage.css"

const RegisterPage: React.FC = () => {
  const { handleRegister, loading } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("As senhas não coincidem!");
      return;
    }

    try {
      await handleRegister(email, password, name);
      navigate("/"); 
    } catch (error) {
      console.error("Erro ao registrar:", error);
      alert("Falha ao registrar.");
    } 
  };

  return (
    <div style={{ fontFamily: 'Inter, "Noto Sans", sans-serif' }}>
      <Header />
      <div className="main">
        <h1 className="text-center">
          Registrar-se no UnBacklog
        </h1>
        <div className="input-container">
          <label>Nome</label>
          <TextField
            placeholder="Insira o seu primeiro Nome"  
            fullWidth
            variant="outlined"
            className="custom-input"
            onChange={(event) => setName(event.target.value)}
            value={name}
          />

          <label>Email</label>
          <TextField
            placeholder="Insira o seu email"  
            fullWidth
            variant="outlined"
            className="custom-input"
            onChange={(event) => setEmail(event.target.value)}
            value={email}
          />

          <label>Senha</label>
          <TextField
            placeholder="Insira sua Senha"  
            fullWidth
            variant="outlined"
            className="custom-input"
            onChange={(event) => setPassword(event.target.value)}
            value={password}
            type="password"
          />

          <label>Confirme sua Senha</label>
          <TextField
            placeholder="Confirme sua Senha"  
            fullWidth
            variant="outlined"
            className="custom-input"
            onChange={(event) => setConfirmPassword(event.target.value)}
            value={confirmPassword}
            type="password"
          />

          <Button variant="contained" className="custom-button" onClick={handleSubmit}>
            Registrar-se
          </Button>
        </div>

        <div>
          <p>
            Já possui conta?{" "}
            <span 
              style={{ color: "#006633", cursor: "pointer", fontWeight: "bold" }}
              onClick={() => navigate("/login")}
            >
              Login
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
