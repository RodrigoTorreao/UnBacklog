// CreateTaskModal.tsx
import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  MenuItem,
  Alert,
} from "@mui/material";
import { TaskStatus, TaskPriority, type UserStory, type Associates } from "../types/types";
import { createTask } from "../api/projectApi";

interface CreateTaskModalProps {
  open: boolean;
  onClose: () => void;
  sprintId: string;
  userStories: UserStory[];
  associates: Associates[];
  onTaskCreated: () => void;
}

const CreateTaskModal: React.FC<CreateTaskModalProps> = ({
  open,
  onClose,
  sprintId,
  userStories,
  associates,
  onTaskCreated,
}) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: TaskStatus.TO_DO,
    priority: TaskPriority.MEDIUM,
    userStoryId: "",
    responsableId: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Resetar o formulário quando o modal abrir
  useEffect(() => {
    if (open) {
      setFormData({
        title: "",
        description: "",
        status: TaskStatus.TO_DO,
        priority: TaskPriority.MEDIUM,
        userStoryId: "",
        responsableId: "",
      });
      setError("");
    }
  }, [open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.title.trim()) {
      setError("O título é obrigatório");
      return;
    }

    setLoading(true);
    setError("");
    try {
      await createTask(sprintId, {
        title: formData.title,
        description: formData.description || undefined,
        status: formData.status,
        priority: formData.priority,
        userStoryId: formData.userStoryId || undefined,
        responsableId: formData.responsableId || undefined,
      });
      onTaskCreated();
      onClose();
    } catch (error) {
      console.error("Erro ao criar task:", error);
      setError("Erro ao criar task");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    "& .MuiOutlinedInput-root": {
      borderRadius: "10px",
      backgroundColor: "#f8fcfa",
      border: "1px solid #cdeadb",
      fontSize: "1rem",
      color: "#0c1d14",
      "& fieldset": {
        borderColor: "#cdeadb",
      },
      "&:hover fieldset": {
        borderColor: "#cdeadb",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#cdeadb",
      },
      "& input::placeholder, & textarea::placeholder": {
        color: "#45a173",
        opacity: 1,
      },
    },
    "& .MuiInputBase-input": {
      padding: "15px",
    },
    "& label": {
      color: "#0c1d14",
      fontWeight: 500,
    },
    "& label.Mui-focused": {
      color: "#0c1d14",
    },
  };

  return (
    <Modal 
      open={open} 
      onClose={onClose}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Box
        sx={{
          backgroundColor: "white",
          borderRadius: 3,
          boxShadow: 24,
          p: 4,
          width: "90%",
          maxWidth: 550,
          maxHeight: "90vh",
          overflow: "auto",
          display: "flex",
          flexDirection: "column",
          gap: 3,
          fontFamily: 'Inter, "Noto Sans", sans-serif',
        }}
      >
        <Typography
          variant="h6"
          sx={{
            color: "#0c1d14",
            fontWeight: 600,
            fontSize: "1.25rem",
            marginBottom: "10px",
          }}
        >
          Criar Nova Task
        </Typography>

        {error && <Alert severity="error">{error}</Alert>}

        {/* Título */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <p
            style={{
              color: "#0c1d14",
              fontSize: "1rem",
              fontWeight: 500,
              marginBottom: "6px",
            }}
          >
            Título *
          </p>
          <TextField
            name="title"
            placeholder="Digite o título da task"
            value={formData.title}
            onChange={handleChange}
            fullWidth
            sx={inputStyle}
          />
        </div>

        {/* Descrição */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <p
            style={{
              color: "#0c1d14",
              fontSize: "1rem",
              fontWeight: 500,
              marginBottom: "6px",
            }}
          >
            Descrição
          </p>
          <TextField
            name="description"
            placeholder="Digite a descrição"
            value={formData.description}
            onChange={handleChange}
            fullWidth
            multiline
            rows={3}
            sx={inputStyle}
          />
        </div>

        {/* Status */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <p
            style={{
              color: "#0c1d14",
              fontSize: "1rem",
              fontWeight: 500,
              marginBottom: "6px",
            }}
          >
            Status
          </p>
          <TextField
            select
            name="status"
            value={formData.status}
            onChange={handleChange}
            fullWidth
            sx={inputStyle}
          >
            <MenuItem value={TaskStatus.TO_DO}>A Fazer</MenuItem>
            <MenuItem value={TaskStatus.DOING}>Em Progresso</MenuItem>
            <MenuItem value={TaskStatus.DONE}>Concluído</MenuItem>
          </TextField>
        </div>

        {/* Prioridade */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <p
            style={{
              color: "#0c1d14",
              fontSize: "1rem",
              fontWeight: 500,
              marginBottom: "6px",
            }}
          >
            Prioridade
          </p>
          <TextField
            select
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            fullWidth
            sx={inputStyle}
          >
            <MenuItem value={TaskPriority.LOW}>Baixa</MenuItem>
            <MenuItem value={TaskPriority.MEDIUM}>Média</MenuItem>
            <MenuItem value={TaskPriority.HIGH}>Alta</MenuItem>
          </TextField>
        </div>

        {/* História de Usuário */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <p
            style={{
              color: "#0c1d14",
              fontSize: "1rem",
              fontWeight: 500,
              marginBottom: "6px",
            }}
          >
            História de Usuário
          </p>
          <TextField
            select
            name="userStoryId"
            value={formData.userStoryId}
            onChange={handleChange}
            fullWidth
            sx={inputStyle}
          >
            <MenuItem value="">Nenhuma</MenuItem>
            {userStories.map((story) => (
              <MenuItem key={story.id} value={story.id}>
                {story.title}
              </MenuItem>
            ))}
          </TextField>
        </div>

        {/* Responsável */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <p
            style={{
              color: "#0c1d14",
              fontSize: "1rem",
              fontWeight: 500,
              marginBottom: "6px",
            }}
          >
            Responsável
          </p>
          <TextField
            select
            name="responsableId"
            value={formData.responsableId}
            onChange={handleChange}
            fullWidth
            sx={inputStyle}
          >
            <MenuItem value="">Nenhum</MenuItem>
            {associates.map((associate) => (
              <MenuItem key={associate.userId} value={associate.userId}>
                {associate.name} ({associate.email})
              </MenuItem>
            ))}
          </TextField>
        </div>

        {/* Botões */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}>
          <Button
            onClick={onClose}
            sx={{
              color: "#006633",
              textTransform: "none",
              fontWeight: 500,
              mr: 1,
            }}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={loading || !formData.title.trim() || !formData.userStoryId}
            sx={{
              backgroundColor: "#006633",
              textTransform: "none",
              fontWeight: 500,
              "&:hover": { backgroundColor: "#004d26" },
              "&:disabled": { backgroundColor: "#cccccc" },
            }}
          >
            {loading ? "Criando..." : "Criar Task"}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default CreateTaskModal;