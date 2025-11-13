// KanbanTab.tsx (atualizado)
import React, { useEffect, useState } from "react";
import { useProject } from "../context/ProjectContext";
import { type Task, type UserStory, SprintStatus } from "../types/types";
import { getTasks } from "../api/projectApi";
import {
  Box,
  Typography,
  Button,
  LinearProgress,
  Card,
  CardContent,
  Chip,
} from "@mui/material";
import CreateTaskModal from "./CreateTaskModal";

const KanbanTab: React.FC = () => {
  const { project } = useProject();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [openCreateTaskModal, setOpenCreateTaskModal] = useState(false);

  // Encontrar sprint ativa
  const activeSprint = project.sprints?.find(
    sprint => sprint.status === SprintStatus.ACTIVE
  );

  // Buscar tasks quando a sprint ativa mudar
  const fetchTasks = async () => {
    if (!activeSprint?.id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await getTasks(activeSprint.id);
      setTasks(response.data);
    } catch (error) {
      console.error("Erro ao buscar tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [activeSprint?.id]);

  // Filtrar histórias de usuário da sprint ativa
  const sprintUserStories = project.userStories?.filter(
    story => story.sprint === activeSprint?.id
  ) || [];

  // Calcular porcentagem de completude
  const calculateCompletion = () => {
    if (sprintUserStories.length === 0) return 0;
    
    const completedStories = sprintUserStories.filter(
      story => story.status === "DONE"
    ).length;
    
    return (completedStories / sprintUserStories.length) * 100;
  };

  const completionPercentage = calculateCompletion();

  // Contar tasks por história
  const getTaskCountForStory = (storyId?: string) => {
    if (!storyId) return 0;
    return tasks.filter(task => task.userStoryId === storyId).length;
  };

  const handleTaskCreated = () => {
    fetchTasks(); // Recarrega as tasks
  };

  if (loading) {
    return (
      <div style={{ fontFamily: 'Inter, "Noto Sans", sans-serif', padding: "20px" }}>
        <Typography>Carregando...</Typography>
      </div>
    );
  }

  if (!activeSprint) {
    return (
      <div style={{ fontFamily: 'Inter, "Noto Sans", sans-serif', padding: "20px" }}>
        <Box sx={{ textAlign: "center", padding: "40px" }}>
          <Typography variant="h5" sx={{ color: "#666", marginBottom: 2 }}>
            Nenhuma sprint ativa no momento
          </Typography>
          <Typography variant="body1" sx={{ color: "#888" }}>
            Ative uma sprint para visualizar o quadro Kanban.
          </Typography>
        </Box>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: 'Inter, "Noto Sans", sans-serif', padding: "20px" }}>
      {/* Cabeçalho com nome da sprint e botão */}
      <Box sx={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center", 
        marginBottom: 3 
      }}>
        <Typography 
          variant="h4" 
          sx={{ 
            color: "#0c1d14",
            fontWeight: 600,
            fontSize: "2rem"
          }}
        >
          {activeSprint.objective}
        </Typography>
        
        <Button
          variant="contained"
          onClick={() => setOpenCreateTaskModal(true)}
          sx={{
            color: "#f8fcfa",
            backgroundColor: "#006633",
            borderRadius: "12px",
            textTransform: "none",
            fontWeight: 500,
            fontSize: "1rem",
            padding: "12px 24px",
            "&:hover": {
              backgroundColor: "#004d26",
            }
          }}
        >
          Nova Task
        </Button>
      </Box>

      {/* Barra de progresso */}
      <Box sx={{ marginBottom: 4 }}>
        <Box sx={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center", 
          marginBottom: 1 
        }}>
          <Typography 
            variant="body1" 
            sx={{ 
              color: "#0c1d14",
              fontWeight: 500
            }}
          >
            Progresso da Sprint
          </Typography>
          <Typography 
            variant="body1" 
            sx={{ 
              color: "#45a173",
              fontWeight: 600
            }}
          >
            {Math.round(completionPercentage)}%
          </Typography>
        </Box>
        <LinearProgress
          variant="determinate"
          value={completionPercentage}
          sx={{
            height: 12,
            borderRadius: 6,
            backgroundColor: "#e6f4ed",
            "& .MuiLinearProgress-bar": {
              backgroundColor: "#45a173",
              borderRadius: 6,
            }
          }}
        />
      </Box>

      {/* Backlog da Sprint */}
      <Box sx={{ marginBottom: 4 }}>
        <Typography 
          variant="h5" 
          sx={{ 
            color: "#0c1d14",
            fontWeight: 600,
            marginBottom: 2,
            fontSize: "1.5rem"
          }}
        >
          Backlog da Sprint
        </Typography>

        {sprintUserStories.length === 0 ? (
          <Box
            sx={{
              textAlign: "center",
              padding: "40px",
              backgroundColor: "#f9f9f9",
              borderRadius: "10px",
              border: "2px dashed #e6f4ed"
            }}
          >
            <Typography sx={{ color: "#666" }}>
              Nenhuma história de usuário associada a esta sprint.
            </Typography>
          </Box>
        ) : (
          <Box sx={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", 
            gap: 2 
          }}>
            {sprintUserStories.map((story) => (
              <Card
                key={story.id}
                sx={{
                  borderRadius: "10px",
                  border: "2px solid #e6f4ed",
                  boxShadow: "none",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    boxShadow: "0 4px 8px rgba(0, 102, 51, 0.1)",
                    borderColor: "#45a173",
                  }
                }}
              >
                <CardContent sx={{ padding: "16px" }}>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      color: "#0c1d14",
                      fontWeight: 600,
                      fontSize: "1.1rem",
                      marginBottom: 1,
                      lineHeight: 1.3
                    }}
                  >
                    {story.title}
                  </Typography>
                  
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Chip
                      label={`${getTaskCountForStory(story.id)} task${getTaskCountForStory(story.id) !== 1 ? 's' : ''} associada${getTaskCountForStory(story.id) !== 1 ? 's' : ''}`}
                      sx={{
                        backgroundColor: "#e6f4ed",
                        color: "#45a173",
                        fontWeight: 500,
                        fontSize: "0.8rem"
                      }}
                      size="small"
                    />
                    
                    <Chip
                      label={story.status === "DONE" ? "Concluída" : story.status === "DOING" ? "Em Progresso" : "A Fazer"}
                      sx={{
                        backgroundColor: story.status === "DONE" ? "#e8f5e8" : 
                                        story.status === "DOING" ? "#e3f2fd" : "#fff3e0",
                        color: story.status === "DONE" ? "#2e7d32" : 
                              story.status === "DOING" ? "#1976d2" : "#f57c00",
                        fontWeight: 500,
                        fontSize: "0.8rem"
                      }}
                      size="small"
                    />
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        )}
      </Box>

      {/* Espaço do Kanban (placeholder para implementação futura) */}
      <Box sx={{ marginBottom: 4 }}>
        <Typography 
          variant="h5" 
          sx={{ 
            color: "#0c1d14",
            fontWeight: 600,
            marginBottom: 2,
            fontSize: "1.5rem"
          }}
        >
          Quadro Kanban
        </Typography>
        
        <Box
          sx={{
            padding: "40px",
            backgroundColor: "#f9f9f9",
            borderRadius: "10px",
            border: "2px dashed #e6f4ed",
            textAlign: "center"
          }}
        >
          <Typography 
            variant="body1" 
            sx={{ 
              color: "#666",
              marginBottom: 2
            }}
          >
            O quadro Kanban será implementado em breve.
          </Typography>
          <Typography 
            variant="body2" 
            sx={{ 
              color: "#888"
            }}
          >
            Aqui serão exibidas as tasks organizadas por status (TO_DO, DOING, DONE).
          </Typography>
        </Box>
      </Box>

      {/* Modal de criação de task */}
      <CreateTaskModal
        open={openCreateTaskModal}
        onClose={() => setOpenCreateTaskModal(false)}
        sprintId={activeSprint.id!}
        userStories={sprintUserStories}
        associates={project.associates || []}
        onTaskCreated={handleTaskCreated}
      />
    </div>
  );
};

export default KanbanTab;