// EditUserStoryModal.tsx
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
import { type UserStory, UserStoryPriority, UserStoryStatus, type Sprint } from "../types/types";
import { updateUserStory } from "../api/projectApi";

interface EditUserStoryModalProps {
  open: boolean;
  onClose: () => void;
  userStory: UserStory | null;
  projectId: string;
  sprints: Sprint[];
  onUpdate: (updatedStory: UserStory) => void;
}

const EditUserStoryModal: React.FC<EditUserStoryModalProps> = ({
  open,
  onClose,
  userStory,
  projectId,
  sprints,
  onUpdate,
}) => {
  const [formData, setFormData] = useState<Partial<UserStory>>({
    title: "",
    description: "",
    priority: UserStoryPriority.LOW,
    status: UserStoryStatus.TO_DO,
    sprint: undefined,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Preenche o formulário com os dados da user story quando o modal abre
  useEffect(() => {
    if (userStory) {
      setFormData({
        title: userStory.title || "",
        description: userStory.description || "",
        priority: userStory.priority || UserStoryPriority.LOW,
        status: userStory.status || UserStoryStatus.TO_DO,
        sprint: userStory.sprint || undefined,
      });
    }
  }, [userStory]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!userStory?.id) return;

    setLoading(true);
    setError("");
    try {
      const updateData = {
        title: formData.title,
        description: formData.description,
        priority: formData.priority,
        status: formData.status,
        sprintId: formData.sprint || undefined, 
      };

      await updateUserStory(projectId, userStory.id, updateData);
      
      // Atualiza a user story no contexto
      onUpdate({
        ...userStory,
        ...formData
      });
      
      onClose();
    } catch (error) {
      console.error("Erro ao atualizar história de usuário:", error);
      setError("Erro ao atualizar história de usuário");
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
          width: "90%", // Usa porcentagem para ser responsivo
          maxWidth: 550, // Largura máxima
          maxHeight: "90vh", // Altura máxima
          overflow: "auto", // Scroll se o conteúdo for muito grande
          display: "flex",
          flexDirection: "column",
          gap: 3,
          fontFamily: 'Inter, "Noto Sans", sans-serif',
          // Remove a margem top e usa o flexbox do Modal para centralizar
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
          Editar História de Usuário
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
            Título
          </p>
          <TextField
            name="title"
            placeholder="Digite o título"
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
            <MenuItem value={UserStoryPriority.LOW}>Baixa</MenuItem>
            <MenuItem value={UserStoryPriority.MEDIUM}>Média</MenuItem>
            <MenuItem value={UserStoryPriority.HIGH}>Alta</MenuItem>
          </TextField>
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
            <MenuItem value={UserStoryStatus.TO_DO}>A Fazer</MenuItem>
            <MenuItem value={UserStoryStatus.DOING}>Em Progresso</MenuItem>
            <MenuItem value={UserStoryStatus.DONE}>Concluído</MenuItem>
          </TextField>
        </div>

        {/* Sprint Associada */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <p
            style={{
              color: "#0c1d14",
              fontSize: "1rem",
              fontWeight: 500,
              marginBottom: "6px",
            }}
          >
            Sprint Associada
          </p>
          <TextField
            select
            name="sprint"
            value={formData.sprint || ""}
            onChange={handleChange}
            fullWidth
            sx={inputStyle}
          >
            <MenuItem value="">Nenhuma</MenuItem>
            {sprints.map((sprint) => (
              <MenuItem key={sprint.id} value={sprint.id}>
                {sprint.id ? `#${sprint.id.substring(0, 8)}...` : 'Sem ID'} - {sprint.objective}
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
            disabled={loading}
            sx={{
              backgroundColor: "#006633",
              textTransform: "none",
              fontWeight: 500,
              "&:hover": { backgroundColor: "#004d26" },
              "&:disabled": { backgroundColor: "#cccccc" },
            }}
          >
            {loading ? "Salvando..." : "Salvar"}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default EditUserStoryModal;