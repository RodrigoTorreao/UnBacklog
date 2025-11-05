import React, { useState } from "react";
import { Header } from "../../components/Header";
import { Button, FormControl, MenuItem, Select, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import styles from "./NewProject.module.css";
import { roleMap, type Associates} from "../../types/types";
import { createProject } from "../../api/projectApi";


const NewProject: React.FC = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const navigate = useNavigate();
  const [role, setRole] = useState("")
  const [email, setEmail] = useState(""); 
  const [associates, setAssociates] = useState<Associates[]>([])

  const handleSubmit = async () => {
    try{ 
        await createProject({ 
            name: name, 
            description: description,
            associates: associates
        })
        alert("Projeto criado com sucesso"); 
        navigate("/")
    }
    catch(err){
        alert("Erro ao criar projeto, verifique suas informações");
        console.log(err);
    }
  };

  return (
    <div style={{ fontFamily: 'Inter, "Noto Sans", sans-serif' }}>
      <Header />
      <div className={styles.main}>
        <h1>Criar novo Projeto</h1>
        <form onSubmit={handleSubmit} className={styles.formContainer}>
          <label style={{display: "block", marginBottom: "8px" }}>
            Nome do projeto
          </label>
          <TextField
            placeholder="Insira o nome do projeto"
            fullWidth
            variant="outlined"
            value={name}
            onChange={(e) => setName(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '10px',
                border: '1px solid #cdeadb',
                height: 56,
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#cdeadb',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#cdeadb',
                },
                '&.Mui-focused': {
                  boxShadow: 'none',
                },
              },
              '& .MuiInputBase-input': {
                padding: '15px',
                color: '#45a173',
                fontSize: '1rem',
              },
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#cdeadb',
              },
            }}
          />

          <label
            style={{
              color: "#0c1d14",
              display: "block",
              marginBottom: "8px",
              marginTop: "20px",
            }}
          >
            Descrição
          </label>
          <TextField
            placeholder="Insira a descrição do projeto"
            fullWidth
            variant="outlined"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '10px',
                border: '1px solid #cdeadb',
                height: 56,
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#cdeadb',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#cdeadb',
                },
                '&.Mui-focused': {
                  boxShadow: 'none',
                },
              },
              '& .MuiInputBase-input': {
                padding: '15px',
                color: '#45a173',
                fontSize: '1rem',
              },
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#cdeadb',
              },
            }}
          />

          <h2 style={{ marginTop: "40px"}}>Participantes</h2>
            <label
                style={{
                color: "#0c1d14",
                display: "block",
                marginBottom: "8px",
                marginTop: "20px",
                }}
            >
                Email do Participante 
            </label>
            <TextField
                placeholder="Insira o email do participante"
                fullWidth
                variant="outlined"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                sx={{
                '& .MuiOutlinedInput-root': {
                    borderRadius: '10px',
                    border: '1px solid #cdeadb',
                    height: 56,
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#cdeadb',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#cdeadb',
                    },
                    '&.Mui-focused': {
                    boxShadow: 'none',
                    },
                },
                '& .MuiInputBase-input': {
                    padding: '15px',
                    color: '#45a173',
                    fontSize: '1rem',
                },
                '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#cdeadb',
                },
                }}
            />
            <label
                style={{
                color: "#0c1d14",
                display: "block",
                marginBottom: "8px",
                marginTop: "20px",
                }}
            >
                Role
            </label>
            <FormControl 
                fullWidth 
                variant="outlined"
                sx={{
                    '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                    backgroundColor: '#f8fcfa',
                    border: '1px solid #cdeadb',
                    color: '#0c1d14',
                    height: '56px',

                    '& fieldset': {
                        borderColor: '#cdeadb',
                    },
                    '&:hover fieldset': {
                        borderColor: '#cdeadb',
                    },
                    '&.Mui-focused fieldset': {
                        borderColor: '#cdeadb',
                    },
                    '& .MuiSelect-select': {
                        padding: '15px',
                        color: '#0c1d14',
                        fontSize: '1rem',
                    },
                    },
                    '& .MuiInputLabel-root': {
                    display: 'none',
                    },
                }}
                >
                <Select
                    displayEmpty
                    value={role}
                    onChange={(event) => setRole(event.target.value)}
                    renderValue={(selected) => {
                    if (!selected) {
                        return <span style={{ color: '#45a173' }}>Selecione um papel</span>;
                    }
                    return roleMap.get(selected);
                    }}
                >
                    {Array.from(roleMap.entries()).map(([key, value]) => (
                    <MenuItem key={key} value={key}>
                        {value}
                    </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <Button
                onClick={() =>{
                    if(email && role){
                        setAssociates(prevArray => [...prevArray, {email: email, role: role}]); 
                        setEmail(""); 
                        setRole(''); 
                    }
                }}
                className={styles.createButton}
                sx={{
                    marginTop: '15px',
                    minWidth: '84px',
                    maxWidth: '480px',
                    height: '32px',
                    padding: '0 16px',
                    borderRadius: '8px',
                    backgroundColor: '#e6f4ed',
                    color: '#0c1d14',
                    fontSize: '14px',
                    fontWeight: 500,
                    lineHeight: 'normal',
                    textTransform: 'none',
                    '&:hover': {
                        backgroundColor: '#d0ead6',
                    },
                }}
            >
                Adicionar
            </Button>
        </form>
        <div className={styles.associatesSection}>
            {associates.map((associate) => (
                <div
                    key={associate.email}
                    className={styles.associateItem}
                >
                    <div className={styles.associateInfo}>
                    <p className={styles.associateEmail}>{associate.email}</p>
                    <p className={styles.associateRole}>{roleMap.get(associate.role)}</p>
                    </div>

                    <Button
                    onClick={() => {
                        setAssociates(prev => prev.filter(a => a.email !== associate.email));
                    }}
                    className={styles.removeButton}
                    >
                    Remover
                    </Button>
                </div>
            ))}
        </div>
        <div className={styles.associatesFooter}>
        <div style={{ flex: 1 }}></div>
            <div className={styles.footerButtons}>
                <Button
                className={styles.cancelButton}
                onClick={() => navigate(-1)}
                >
                Cancelar
                </Button>
                <Button
                type="submit"
                className={styles.saveButton}
                onClick={handleSubmit}
                >
                Salvar
                </Button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default NewProject;
