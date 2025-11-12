import React, { useState, useContext } from "react";
import { Button } from "@mui/material";
import { useProject } from "../context/ProjectContext";
import { AuthContext } from "../context/AuthContext";
import SprintComponent from "./SprintComponent";
import CreateSprintModal from "./CreateSprintModal";

const SprintsTab: React.FC = () => {
  const { project } = useProject();
  const { user } = useContext(AuthContext);
  const [openModal, setOpenModal] = useState(false);
  
  const sprints = project.sprints || [];

  // Verifica se o usuário logado é Product Owner neste projeto
  const isProductOwner = project.associates?.some(
    associate => 
      associate.email === user?.email && 
      associate.role === "PRODUCT_OWNER"
  );

  return (
    <div style={{ fontFamily: 'Inter, "Noto Sans", sans-serif', padding: "20px" }}>
      {/* Cabeçalho com título e botão */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "25px"
      }}>
        <h2 style={{ 
          margin: 0,
          color: "#0c1d14",
          fontSize: "1.8em",
          fontWeight: "600"
        }}>
          Sprints do Projeto
        </h2>
        
        {/* Botão condicional para Product Owner */}
        {isProductOwner && (
          <Button 
            style={{
              color: "#f8fcfa", 
              width: "20em", 
              height: "4em", 
              backgroundColor: "#006633", 
              borderRadius: "12px",
              textTransform: "none",
              fontSize: "1em",
              fontWeight: "500"
            }}
            onClick={() => setOpenModal(true)}
          >
            Nova Sprint
          </Button>
        )}
      </div>
      
      {sprints.length === 0 ? (
        <div style={{
          textAlign: "center",
          padding: "40px",
          color: "#666",
          backgroundColor: "#f9f9f9",
          borderRadius: "10px",
          border: "2px dashed #e6f4ed"
        }}>
          <p style={{ margin: 0, fontSize: "1.1em" }}>
            {isProductOwner 
              ? "Nenhuma sprint cadastrada para este projeto. Clique em 'Nova Sprint' para começar."
              : "Nenhuma sprint cadastrada para este projeto."
            }
          </p>
        </div>
      ) : (
        <div>
          {sprints.map((sprint) => (
            <SprintComponent 
              key={sprint.id} 
              sprint={sprint}
              project={project}
            />
          ))}
        </div>
      )}

      {/* Modal para criar nova sprint */}
      <CreateSprintModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        projectId={project.id!}
      />
    </div>
  );
};

export default SprintsTab;