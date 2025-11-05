import React, { useContext, useEffect, useState } from "react";
import { Button, TableContainer, Table, TableHead, TableBody, TableRow, TableCell, Paper } from "@mui/material";
import { Header } from "../../components/Header";
import { getProjects } from "../../api/projectApi";
import styles from "./HomePage.module.css";
import { AuthContext } from "../../context/AuthContext";
import { roleMap } from "../../types/types";
import { useNavigate } from "react-router-dom";

interface Project {
    name: string;
    description: string;
    id: string
    users: users[]
}

interface users{
    name: string, 
    email: string, 
    role: string 
}

const HomePage: React.FC = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const { user } = useContext(AuthContext)
    const navigate = useNavigate();

    useEffect(()=>{
        const fetchProjects = async () => {
            try{
                const response = await getProjects()
                setProjects(response.data)
            }
            catch(error){
                alert("Erro ao buscar projetos");
            }
        }
        fetchProjects();
        setLoading(false);
    }, [])

    const handleView =  () => { 
        
    }


    const getUseRole = (project: Project) => {
        const role  = project.users.find(u => u.name === user?.name)?.role
        if(role){
            return roleMap.get(role)
        }
        else return ''
    }

    return (
        <div style={{ fontFamily: 'Inter, "Noto Sans", sans-serif' }}>
            <Header />
            <div className={styles.main}>
                <div className={styles.title}>
                    <p className={styles.titleText}>
                        Meus Projetos
                    </p>
                    <Button
                        onClick={() =>{navigate("/new-project")}}
                        className={styles.createButton}
                        sx={{
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
                        Novo
                    </Button>
                </div>

                <div className={styles.Table}>
                    <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
                        <Table sx={{ width: '100%', tableLayout: 'fixed' }}>
                            <TableHead>
                                <TableRow>
                                    <TableCell><strong>Nome</strong></TableCell>
                                    <TableCell><strong>Descrição</strong></TableCell>
                                    <TableCell><strong>Papel</strong></TableCell>
                                    <TableCell><strong>Ação</strong></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {projects.map((project, index) => (
                                    <TableRow 
                                        key={index} 
                                        sx={{ 
                                            backgroundColor: '#fff',
                                            '&:last-child td, &:last-child th': { border: 0 }
                                        }}
                                    >
                                        <TableCell sx={{ color: '#000' }}>{project.name}</TableCell>
                                        <TableCell sx={{ color: '#000' }}>{project.description}</TableCell>
                                        <TableCell>
                                            <span 
                                                style={{ 
                                                    backgroundColor: '#e6f4ed',
                                                    color: '#006633',
                                                    padding: '4px 8px',
                                                    borderRadius: '8px',
                                                    display: 'inline-block',
                                                    fontWeight: 500,
                                                    fontSize: '0.875rem'
                                                }}
                                            >
                                                {getUseRole(project)}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                variant="text"
                                                size="small"
                                                onClick={() => handleView()}
                                                sx={{
                                                    backgroundColor: 'transparent',
                                                    color: '#006633',
                                                    textTransform: 'none',
                                                    '&:hover': { backgroundColor: 'rgba(0, 102, 51, 0.1)' },
                                                }}
                                            >
                                                Visualizar
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                </div>  
            </div>
        </div>
    );
};

export default HomePage;
