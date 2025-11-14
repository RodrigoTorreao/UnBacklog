// KanbanBoard.tsx (com cores do tema)
import React from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  Avatar,
  AvatarGroup,
  Snackbar,
  Alert,
} from "@mui/material";
import { type Task, TaskStatus, TaskPriority } from "../types/types";
import { updateTask } from "../api/projectApi";

interface KanbanBoardProps {
  tasks: Task[];
  onTaskUpdate: (updatedTask: Task) => void;
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({ tasks, onTaskUpdate }) => {
  const [error, setError] = React.useState<string>("");
  const [loadingTaskId, setLoadingTaskId] = React.useState<string | null>(null);

  // Agrupar tasks por status
  const todoTasks = tasks.filter(task => task.status === TaskStatus.TO_DO);
  const doingTasks = tasks.filter(task => task.status === TaskStatus.DOING);
  const doneTasks = tasks.filter(task => task.status === TaskStatus.DONE);

  // Cores do tema - apenas tons de verde
  const columnColors = {
    [TaskStatus.TO_DO]: "#45a173",     // Verde médio
    [TaskStatus.DOING]: "#006633",     // Verde escuro principal
    [TaskStatus.DONE]: "#2e7d32",      // Verde concluído
  };

  const getStatusText = (status: TaskStatus) => {
    switch (status) {
      case TaskStatus.TO_DO:
        return "A Fazer";
      case TaskStatus.DOING:
        return "Em Progresso";
      case TaskStatus.DONE:
        return "Concluído";
      default:
        return status;
    }
  };

  const getPriorityColor = (priority: TaskPriority) => {
    switch (priority) {
      case TaskPriority.HIGH:
        return { background: "#ffebee", color: "#c62828" };
      case TaskPriority.MEDIUM:
        return { background: "#fff3e0", color: "#ef6c00" };
      case TaskPriority.LOW:
        return { background: "#e8f5e8", color: "#2e7d32" };
      default:
        return { background: "#f5f5f5", color: "#616161" };
    }
  };

  const getNextStatus = (currentStatus: TaskStatus): TaskStatus | null => {
    switch (currentStatus) {
      case TaskStatus.TO_DO:
        return TaskStatus.DOING;
      case TaskStatus.DOING:
        return TaskStatus.DONE;
      case TaskStatus.DONE:
        return null;
      default:
        return null;
    }
  };

  const getNextStatusText = (currentStatus: TaskStatus): string => {
    const nextStatus = getNextStatus(currentStatus);
    switch (nextStatus) {
      case TaskStatus.DOING:
        return "Iniciar";
      case TaskStatus.DONE:
        return "Concluir";
      default:
        return "Concluído";
    }
  };

  const handleMoveTask = async (task: Task, newStatus: TaskStatus) => {
    // Verificar se o task.id existe
    if (!task.id) {
      setError("ID da task não encontrado");
      return;
    }

    setLoadingTaskId(task.id);
    setError("");

    try {
      const updatedTask = { ...task, status: newStatus };
      await updateTask(task.id, { status: newStatus });
      onTaskUpdate(updatedTask);
    } catch (error: any) {
      console.error("Erro ao mover task:", error);
      
      // Verificar se é erro de autorização (403)
      if (error.response?.status === 403) {
        setError("Você não tem permissão para atualizar esta task");
      } else if (error.response?.status === 404) {
        setError("Task não encontrada");
      } else {
        setError("Erro ao mover a task. Tente novamente.");
      }
    } finally {
      setLoadingTaskId(null);
    }
  };

  const Column: React.FC<{ 
    title: string; 
    tasks: Task[]; 
    status: TaskStatus;
  }> = ({ title, tasks, status }) => {
    const color = columnColors[status];
    
    return (
      <Box sx={{ 
        flex: 1, 
        minHeight: "600px",
        backgroundColor: "#f8fcfa",
        borderRadius: "12px",
        padding: "16px",
        display: "flex",
        flexDirection: "column",
        border: `2px solid ${color}20`
      }}>
        {/* Cabeçalho da Coluna */}
        <Box sx={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center",
          marginBottom: "16px",
          paddingBottom: "12px",
          borderBottom: `2px solid ${color}40`
        }}>
          <Typography 
            variant="h6" 
            sx={{ 
              color: color,
              fontWeight: 600,
              fontSize: "1.1rem"
            }}
          >
            {title}
          </Typography>
          <Chip 
            label={tasks.length}
            sx={{
              backgroundColor: color,
              color: "white",
              fontWeight: 600
            }}
          />
        </Box>

        {/* Lista de Tasks */}
        <Box sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
          {tasks.map((task) => (
            <Card
              key={task.id}
              sx={{
                borderRadius: "10px",
                border: `1px solid ${color}30`,
                boxShadow: "0 2px 8px rgba(0, 102, 51, 0.1)",
                transition: "all 0.3s ease",
                "&:hover": {
                  boxShadow: "0 4px 16px rgba(0, 102, 51, 0.15)",
                  transform: "translateY(-2px)",
                }
              }}
            >
              <CardContent sx={{ padding: "16px" }}>
                {/* Título e Prioridade */}
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 1 }}>
                  <Typography 
                    variant="subtitle1" 
                    sx={{ 
                      fontWeight: 600,
                      color: "#0c1d14",
                      lineHeight: 1.3,
                      flex: 1,
                      marginRight: 1
                    }}
                  >
                    {task.title}
                  </Typography>
                  <Chip
                    label={task.priority === "HIGH" ? "Alta" : task.priority === "MEDIUM" ? "Média" : "Baixa"}
                    size="small"
                    sx={{
                      backgroundColor: getPriorityColor(task.priority).background,
                      color: getPriorityColor(task.priority).color,
                      fontWeight: 500,
                      fontSize: "0.7rem",
                      minWidth: "60px"
                    }}
                  />
                </Box>

                {/* Descrição */}
                {task.description && (
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: "#666",
                      marginBottom: 2,
                      lineHeight: 1.4
                    }}
                  >
                    {task.description.length > 100 
                      ? `${task.description.substring(0, 100)}...` 
                      : task.description
                    }
                  </Typography>
                )}

                {/* Informações Adicionais */}
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 2 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <AvatarGroup max={3} sx={{ '& .MuiAvatar-root': { width: 24, height: 24, fontSize: '0.8rem' } }}>
                      <Avatar 
                        sx={{ 
                          backgroundColor: "#45a173",
                          fontSize: "0.7rem"
                        }}
                      >
                        {task.responsableId ? task.responsableId.substring(0, 2).toUpperCase() : "?"}
                      </Avatar>
                    </AvatarGroup>
                    <Typography variant="caption" sx={{ color: "#888" }}>
                      {task.userStoryId ? "Com história" : "Sem história"}
                    </Typography>
                  </Box>
                </Box>

                {/* Botão de Ação */}
                {getNextStatus(task.status) && (
                  <Button
                    variant="contained"
                    fullWidth
                    disabled={loadingTaskId === task.id}
                    onClick={() => handleMoveTask(task, getNextStatus(task.status)!)}
                    sx={{
                      backgroundColor: color,
                      color: "white",
                      textTransform: "none",
                      fontWeight: 500,
                      borderRadius: "8px",
                      padding: "8px 16px",
                      fontSize: "0.8rem",
                      "&:hover": {
                        backgroundColor: color,
                        filter: "brightness(0.9)",
                      },
                      "&:disabled": {
                        backgroundColor: "#e6f4ed",
                        color: "#45a173",
                      }
                    }}
                  >
                    {loadingTaskId === task.id ? "Movendo..." : getNextStatusText(task.status)}
                  </Button>
                )}

                {/* Indicador de Concluído */}
                {task.status === TaskStatus.DONE && (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "8px",
                      backgroundColor: "#e8f5e8",
                      borderRadius: "6px",
                      border: "1px solid #45a17330"
                    }}
                  >
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        color: "#2e7d32",
                        fontWeight: 600,
                        fontSize: "0.7rem"
                      }}
                    >
                      ✓ Concluído
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          ))}

          {tasks.length === 0 && (
            <Box
              sx={{
                textAlign: "center",
                padding: "40px 20px",
                color: "#888",
                border: "2px dashed #e6f4ed",
                borderRadius: "8px",
                backgroundColor: "white"
              }}
            >
              <Typography variant="body2">
                Nenhuma task nesta coluna
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    );
  };

  return (
    <>
      <Box sx={{ 
        display: "grid", 
        gridTemplateColumns: "1fr 1fr 1fr", 
        gap: 3,
        minHeight: "600px"
      }}>
        <Column 
          title="A Fazer" 
          tasks={todoTasks} 
          status={TaskStatus.TO_DO}
        />
        <Column 
          title="Em Progresso" 
          tasks={doingTasks} 
          status={TaskStatus.DOING}
        />
        <Column 
          title="Concluído" 
          tasks={doneTasks} 
          status={TaskStatus.DONE}
        />
      </Box>

      {/* Snackbar para erros */}
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError("")}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setError("")} 
          severity="error" 
          sx={{ width: '100%' }}
        >
          {error}
        </Alert>
      </Snackbar>
    </>
  );
};

export default KanbanBoard;