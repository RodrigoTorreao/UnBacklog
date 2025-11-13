import React, { useState } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
} from "@mui/material";
import { type Sprint, SprintStatus } from "../types/types";
import { createSprint } from "../api/projectApi";
import { useProject } from "../context/ProjectContext";

interface CreateSprintModalProps {
  open: boolean;
  onClose: () => void;
  projectId: string;
}

const CreateSprintModal: React.FC<CreateSprintModalProps> = ({
  open,
  onClose,
  projectId,
}) => {
  const { addSprint } = useProject();
  const [formData, setFormData] = useState<Omit<Sprint, 'id'>>({
    objective: "",
    startDate: "",
    finishDate: "",
    status: SprintStatus.PLANNED,
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.objective.trim()) {
      alert("O objetivo é obrigatório");
      return;
    }

    setLoading(true);
    try {
      // Formatar as datas para o padrão ISO
      const formattedData = {
        ...formData,
        startDate: formData.startDate ? `${formData.startDate}T00:00:00` : undefined,
        finishDate: formData.finishDate ? `${formData.finishDate}T00:00:00` : undefined,
      };

      const response = await createSprint(projectId, formattedData);
      
      // Mapear o retorno da API para o formato do contexto
      const newSprint: Sprint = {
        ...response.data,
        id: response.data.sprintId, // Mapear sprintId para id
      };
      
      // Adiciona a sprint ao contexto - isso deve disparar a re-renderização
      addSprint(newSprint);
      
      // Fecha o modal e reseta o formulário
      onClose();
      setFormData({
        objective: "",
        startDate: "",
        finishDate: "",
        status: SprintStatus.PLANNED,
      });
      
    } catch (error) {
      console.error("Erro ao criar sprint:", error);
      alert("Erro ao criar sprint");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    onClose();
    // Reseta o formulário ao fechar
    setFormData({
      objective: "",
      startDate: "",
      finishDate: "",
      status: SprintStatus.PLANNED,
    });
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
    <Modal open={open} onClose={handleClose}>
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
          Criar Nova Sprint
        </Typography>

        {/* Objetivo */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <p
            style={{
              color: "#0c1d14",
              fontSize: "1rem",
              fontWeight: 500,
              marginBottom: "6px",
            }}
          >
            Objetivo *
          </p>
          <TextField
            name="objective"
            placeholder="Digite o objetivo da sprint"
            value={formData.objective}
            onChange={handleChange}
            fullWidth
            sx={inputStyle}
          />
        </div>

        {/* Data de Início */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <p
            style={{
              color: "#0c1d14",
              fontSize: "1rem",
              fontWeight: 500,
              marginBottom: "6px",
            }}
          >
            Data de Início (Opcional)
          </p>
          <TextField
            name="startDate"
            type="date"
            value={formData.startDate}
            onChange={handleChange}
            fullWidth
            sx={inputStyle}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </div>

        {/* Data de Término */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <p
            style={{
              color: "#0c1d14",
              fontSize: "1rem",
              fontWeight: 500,
              marginBottom: "6px",
            }}
          >
            Data de Término (Opcional)
          </p>
          <TextField
            name="finishDate"
            type="date"
            value={formData.finishDate}
            onChange={handleChange}
            fullWidth
            sx={inputStyle}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </div>

        {/* Status (fixo como Planned) */}
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
            value="Planejada"
            fullWidth
            sx={inputStyle}
            disabled
            InputProps={{
              style: {
                color: "#666",
              }
            }}
          />
          <p style={{ fontSize: "0.8rem", color: "#666", margin: "5px 0 0 0" }}>
            Todas as novas sprints começam com status "Planejada"
          </p>
        </div>

        {/* Botões */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}>
          <Button
            onClick={handleClose}
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
            disabled={loading || !formData.objective.trim()}
            sx={{
              backgroundColor: "#006633",
              textTransform: "none",
              fontWeight: 500,
              "&:hover": { backgroundColor: "#004d26" },
              "&:disabled": { backgroundColor: "#cccccc" },
            }}
          >
            {loading ? "Criando..." : "Criar Sprint"}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default CreateSprintModal;