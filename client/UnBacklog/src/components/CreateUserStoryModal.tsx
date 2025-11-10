import React, { useState } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  MenuItem,
  Button,
} from "@mui/material";
import { UserStoryPriority, UserStoryStatus, type UserStory } from "../types/types";


interface CreateUserStoryModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: UserStory) => void;
}

const CreateUserStoryModal: React.FC<CreateUserStoryModalProps> = ({
  open,
  onClose,
  onSubmit,
}) => {
  const [formData, setFormData] = useState<UserStory>({
    title: "",
    description: "",
    priority: "LOW",
    status: "TO_DO",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    onSubmit(formData);
    onClose();
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
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          backgroundColor: "white",
          borderRadius: 3,
          boxShadow: 24,
          p: 4,
          maxWidth: 550,
          mx: "auto",
          mt: "8%",
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
          Criar Nova História de Usuário
        </Typography>

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
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            sx={{
              backgroundColor: "#006633",
              textTransform: "none",
              fontWeight: 500,
              "&:hover": { backgroundColor: "#004d26" },
            }}
          >
            Criar
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default CreateUserStoryModal;
