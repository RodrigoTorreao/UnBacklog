import React from "react";
import type { ProjectType, Sprint } from "../types/types";
import { SprintStatus } from "../types/types";

interface SprintComponentProps {
  sprint: Sprint;
  project: ProjectType;
}

const SprintComponent: React.FC<SprintComponentProps> = ({ sprint, project }) => {
  const getStatusColor = (status: SprintStatus) => {
    switch (status) {
      case SprintStatus.PLANNED:
        return { background: "#e3f2fd", color: "#1976d2" }; // Azul claro
      case SprintStatus.ACTIVE:
        return { background: "#e8f5e8", color: "#2e7d32" }; // Verde claro
      case SprintStatus.COMPLETED:
        return { background: "#f3e5f5", color: "#7b1fa2" }; // Roxo claro
      default:
        return { background: "#f5f5f5", color: "#616161" }; // Cinza
    }
  };

  const getStatusText = (status: SprintStatus) => {
    switch (status) {
      case SprintStatus.PLANNED:
        return "Planejada";
      case SprintStatus.ACTIVE:
        return "Ativa";
      case SprintStatus.COMPLETED:
        return "Concluída";
      default:
        return status;
    }
  };

  const statusStyle = getStatusColor(sprint.status);
  
  // Conta apenas as histórias associadas a esta sprint
  const userStoriesCount = project.userStories?.filter(
    story => story.sprint === sprint.id
  ).length || 0;

  return (
    <div style={{
      border: "2px solid #e6f4ed", 
      borderRadius: "10px", 
      padding: "20px",
      marginBottom: "15px",
      backgroundColor: "white",
      minHeight: "180px", // Altura mínima definida
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between"
    }}>
      {/* Cabeçalho com Sprint e Status alinhados */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start", // Alinha ao topo
        marginBottom: "15px"
      }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
            <h3 style={{ 
              margin: 0, 
              fontSize: "1.2em", 
              fontWeight: "600",
              color: "#0c1d14"
            }}>
              Sprint:
            </h3>
            <span style={{
              fontSize: "1em",
              color: "#45a173",
              fontWeight: "500"
            }}>
              {sprint.id ? `#${sprint.id}` : 'ID não disponível'}
            </span>
          </div>
          
          <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
            <h3 style={{ 
              margin: 0, 
              fontSize: "1.2em", 
              fontWeight: "600",
              color: "#0c1d14"
            }}>
              Status:
            </h3>
            <span style={{
              backgroundColor: statusStyle.background,
              color: statusStyle.color,
              padding: "6px 16px",
              borderRadius: "20px",
              fontSize: "0.9em",
              fontWeight: "500",
              minWidth: "100px",
              textAlign: "center"
            }}>
              {getStatusText(sprint.status)}
            </span>
          </div>
        </div>
        
        <button style={{
          background: "none",
          border: "none",
          fontSize: "1.5em",
          cursor: "pointer",
          color: "#45a173",
          padding: "5px 10px",
          borderRadius: "5px",
          transition: "background-color 0.2s",
          alignSelf: "flex-start" // Alinha o botão ao topo
        }}
        onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#f0f0f0"}
        onMouseOut={(e) => e.currentTarget.style.backgroundColor = "transparent"}
        >
          ⋮
        </button>
      </div>

      {/* Conteúdo Principal */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "30px",
        flexGrow: 1 // Ocupa o espaço disponível
      }}>
        {/* Coluna Esquerda - Objetivo */}
        <div>
          <h4 style={{ 
            margin: "0 0 8px 0", 
            fontSize: "0.95em", 
            color: "#666",
            fontWeight: "500"
          }}>
            Objetivo:
          </h4>
          <p style={{ 
            margin: 0, 
            fontSize: "1em",
            lineHeight: "1.4",
            color: "#0c1d14"
          }}>
            {sprint.objective || "Nenhum objetivo definido"}
          </p>
        </div>

        {/* Coluna Direita - Histórias de Usuário */}
        <div>
          <h4 style={{ 
            margin: "0 0 8px 0", 
            fontSize: "0.95em", 
            color: "#666",
            fontWeight: "500"
          }}>
            Histórias de Usuário Associadas:
          </h4>
          <p style={{ 
            margin: 0, 
            fontSize: "1em",
            fontWeight: "500",
            color: userStoriesCount > 0 ? "#45a173" : "#999"
          }}>
            {userStoriesCount === 0 
              ? "Nenhuma história associada" 
              : `${userStoriesCount} história${userStoriesCount !== 1 ? 's' : ''} associada${userStoriesCount !== 1 ? 's' : ''}`
            }
          </p>
        </div>
      </div>

      {/* Datas (se disponíveis) */}
      {(sprint.startDate || sprint.finishDate) && (
        <div style={{
          marginTop: "15px",
          paddingTop: "15px",
          borderTop: "1px solid #f0f0f0",
          fontSize: "0.85em",
          color: "#888"
        }}>
          {sprint.startDate && `Início: ${new Date(sprint.startDate).toLocaleDateString('pt-BR')}`}
          {sprint.startDate && sprint.finishDate && " • "}
          {sprint.finishDate && `Término: ${new Date(sprint.finishDate).toLocaleDateString('pt-BR')}`}
        </div>
      )}
    </div>
  );
};

export default SprintComponent;