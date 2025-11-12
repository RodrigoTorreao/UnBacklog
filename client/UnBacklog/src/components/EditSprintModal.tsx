import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  MenuItem,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { type Sprint, SprintStatus } from "../types/types";
import { updateSprint, deleteSprint } from "../api/projectApi";
import { useProject } from "../context/ProjectContext";

interface EditSprintModalProps {
  open: boolean;
  onClose: () => void;
  sprint: Sprint | null;
  projectId: string;
}

const EditSprintModal: React.FC<EditSprintModalProps> = ({
  open,
  onClose,
  sprint,
  projectId,
}) => {
  const { updateSprints, deleteSprint: deleteSprintContext } = useProject();
  const [formData, setFormData] = useState<Partial<Sprint>>({
    objective: "",
    startDate: "",
    finishDate: "",
    status: SprintStatus.PLANNED,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  // Preenche o formulário com os dados da sprint quando o modal abre
  useEffect(() => {
    if (sprint) {
      setFormData({
        objective: sprint.objective || "",
        startDate: sprint.startDate ? sprint.startDate.split('T')[0] : "",
        finishDate: sprint.finishDate ? sprint.finishDate.split('T')[0] : "",
        status: sprint.status,
      });
    }
  }, [sprint]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!sprint?.id) return;

    setLoading(true);
    setError("");
    try {
      // Formatar as datas para o padrão ISO
      const formattedData = {
        objective: formData.objective,
        startDate: formData.startDate ? `${formData.startDate}T00:00:00` : undefined,
        finishDate: formData.finishDate ? `${formData.finishDate}T00:00:00` : undefined,
        status: formData.status,
      };

      await updateSprint(projectId, sprint.id, formattedData);
      
      // Recarrega as sprints para atualizar a lista
      const getSprints = (await import("../api/projectApi")).getSprints;
      const response = await getSprints(projectId);
      const formattedSprints = response.data.map((s: any) => ({
        ...s,
        id: s.sprintId
      }));
      updateSprints(formattedSprints);
      
      onClose();
    } catch (error) {
      console.error("Erro ao atualizar sprint:", error);
      setError("Erro ao atualizar sprint");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!sprint?.id) return;

    setLoading(true);
    try {
      await deleteSprint(projectId, sprint.id);
      deleteSprintContext(sprint.id);
      setDeleteConfirmOpen(false);
      onClose();
    } catch (error) {
      console.error("Erro ao excluir sprint:", error);
      setError("Erro ao excluir sprint");
    } finally {
      setLoading(false);
    }
  };

  const canDelete = sprint?.status === SprintStatus.PLANNED;

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
    <>
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
            Editar Sprint
          </Typography>

          {error && <Alert severity="error">{error}</Alert>}

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
              Objetivo
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
              Data de Início
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
              Data de Término
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
              <MenuItem value={SprintStatus.PLANNED}>Planejada</MenuItem>
              <MenuItem value={SprintStatus.ACTIVE}>Ativa</MenuItem>
              <MenuItem value={SprintStatus.COMPLETED}>Concluída</MenuItem>
            </TextField>
          </div>

          {/* Botões */}
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
            <Box>
              {canDelete && (
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => setDeleteConfirmOpen(true)}
                  disabled={loading}
                  sx={{
                    textTransform: "none",
                    fontWeight: 500,
                  }}
                >
                  Excluir Sprint
                </Button>
              )}
            </Box>
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
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
        </Box>
      </Modal>

      {/* Modal de confirmação de exclusão */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
      >
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent>
          <Typography>
            Tem certeza que deseja excluir esta sprint? Esta ação não pode ser desfeita.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setDeleteConfirmOpen(false)}
            disabled={loading}
            sx={{
                  color: "#006633",
                  mr: 1,
                }}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleDelete} 
            color="error" 
            variant="contained"
            disabled={loading}
          >
            {loading ? "Excluindo..." : "Excluir"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default EditSprintModal;