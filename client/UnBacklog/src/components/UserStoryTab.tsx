import React, { useState, useMemo } from "react";
import { useProject } from "../context/ProjectContext";
import { type ProjectType, UserStoryStatus, UserStoryPriority, type UserStory} from "../types/types";
import {
  Button,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import CreateUserStoryModal from "./CreateUserStoryModal";
import { createUserStory, deleteUserStoryApi } from "../api/projectApi";

const UserStoryTab: React.FC = () => {
  const { project, addUserStory, deleteUserStory } = useProject();
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [assignee, setAssignee] = useState("");
  const [openModal, setOpenModal] = useState(false);

  const handleEdit = (storyId: string) => console.log("Editar", storyId);
  const handleDelete = async (storyId: string) => {
    try {
      if(!project.id){
        throw new Error
      }
      await deleteUserStoryApi(project.id, storyId)
      deleteUserStory(storyId)

    } catch (error) {
      alert("Erro ao deletar"); 
      console.log(error)
    }
  }

  const filteredStories = useMemo(() => {
    if (!project?.userStories) return [];

    return project.userStories.filter((story) => {
      const matchStatus = !status || story.status === status;
      const matchPriority = !priority || story.priority === priority;
      return matchStatus && matchPriority;
    });
  }, [project, status, priority, assignee]);

  const statusOptions = [
    { label: "Pendente", value: UserStoryStatus.TO_DO },
    { label: "Em andamento", value: UserStoryStatus.DOING },
    { label: "Concluída", value: UserStoryStatus.DONE },
  ];

  const priorityOptions = [
    { label: "Alta", value: UserStoryPriority.HIGH },
    { label: "Média", value: UserStoryPriority.MEDIUM },
    { label: "Baixa", value: UserStoryPriority.LOW },
  ];

  const handleNewUserStory = async (newStory: UserStory) => {
    try{
      if(!project.id){
        throw new Error
      }
      const createdUserStoryId = (await createUserStory(project.id, newStory)).data
      newStory.id = createdUserStoryId
      addUserStory(newStory);

    }
    catch(err){
      alert("Erro ao criar Projeto")
    }
  }

  const assigneeOptions = project?.associates || [];
  const selectStyle = {
    minWidth: 150,
    "& .MuiInputBase-root": {
      backgroundColor: "#e6f4ed",
      border: "none",
      borderRadius: "8px",
      color: "#0c1d14",
    },
    "& .MuiOutlinedInput-notchedOutline": {
      border: "none",
    },
    "&:hover .MuiOutlinedInput-notchedOutline": {
      border: "none",
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      border: "none",
    },
    "& .Mui-focused": {
      color: "#0c1d14 !important",
    },
    "& .MuiInputLabel-root.Mui-focused": {
      color: "#0c1d14 !important",
    },
    "& .MuiSelect-icon": {
      color: "#0c1d14",
    },
  };

  const getReadableStatus = (status?: string) => {
    switch (status) {
      case UserStoryStatus.TO_DO:
        return "Pendente";
      case UserStoryStatus.DOING:
        return "Em andamento";
      case UserStoryStatus.DONE:
        return "Concluída";
      default:
        return "-";
    }
  };

  const getReadablePriority = (priority?: string) => {
    switch (priority) {
      case UserStoryPriority.HIGH:
        return "Alta";
      case UserStoryPriority.MEDIUM:
        return "Média";
      case UserStoryPriority.LOW:
        return "Baixa";
      default:
        return "-";
    }
  };

  return (
    <div style={{ fontFamily: 'Inter, "Noto Sans", sans-serif' }}>
      <h2 style={{ marginBottom: "30px" }}>Histórias de Usuário:</h2>
      <div style={{ display: "flex", gap: "1em", marginBottom: "2em"}}>
        <FormControl sx={selectStyle}>
          <InputLabel>Status</InputLabel>
          <Select
            value={status}
            label="Status"
            onChange={(e) => setStatus(e.target.value)}
          >
            <MenuItem value="">Todos</MenuItem>
            {statusOptions.map((opt) => (
              <MenuItem key={opt.value} value={opt.value}>
                {opt.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={selectStyle}>
          <InputLabel>Prioridade</InputLabel>
          <Select
            value={priority}
            label="Prioridade"
            onChange={(e) => setPriority(e.target.value)}
          >
            <MenuItem value="">Todas</MenuItem>
            {priorityOptions.map((opt) => (
              <MenuItem key={opt.value} value={opt.value}>
                {opt.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button style={{color: "#f8fcfa", marginLeft: "auto", width: "20em", height: "4em", backgroundColor: "#006633", borderRadius: "12px"}}
          onClick={() =>{setOpenModal(true)}}
        >
          Nova História de Usuário
        </Button>
        <CreateUserStoryModal
          open={openModal}
          onClose={() => setOpenModal(false)}
          onSubmit={handleNewUserStory}
        
        />
      </div>

      {/* Tabela */}
      <TableContainer component={Paper} sx={{ boxShadow: "none" }}>
        <Table sx={{ width: "100%", tableLayout: "fixed" }}>
          <TableHead>
            <TableRow>
              <TableCell>
                <strong>Título</strong>
              </TableCell>
              <TableCell>
                <strong>Prioridade</strong>
              </TableCell>
              <TableCell>
                <strong>Status</strong>
              </TableCell>
              <TableCell>
                <strong>Sprint Associada</strong>
              </TableCell>
              <TableCell>
                <strong>Ações</strong>
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredStories.length > 0 ? (
              filteredStories.map((story) => (
                <TableRow key={story.id}>
                  <TableCell>{story.title}</TableCell>

                  {/* PRIORIDADE */}
                  <TableCell>
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "#e6f4ed",
                        color: "#000",
                        padding: "8px 16px",
                        borderRadius: "10px",
                        minWidth: "100px",
                        textAlign: "center",
                      }}
                    >
                      {getReadablePriority(story.priority)}
                    </span>
                  </TableCell>

                  {/* STATUS */}
                  <TableCell>
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "#e6f4ed",
                        color: "#000",
                        padding: "8px 16px",
                        borderRadius: "10px",
                        minWidth: "120px",
                        textAlign: "center",
                      }}
                    >
                      {getReadableStatus(story.status)}
                    </span>
                  </TableCell>

                  <TableCell>{story.sprint || "-"}</TableCell>

                  <TableCell>
                    <div style={{ display: "flex", gap: "0.5em" }}>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => handleEdit(story.id?.toString() ?? "")}
                        sx={{
                          textTransform: "none",
                          color: "#006633",
                          borderColor: "#006633",
                          "&:hover": {
                            backgroundColor: "rgba(0, 102, 51, 0.1)",
                          },
                        }}
                      >
                        Editar
                      </Button>

                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => handleDelete(story.id?.toString() ?? "")}
                        sx={{
                          textTransform: "none",
                          color: "#cc0000",
                          borderColor: "#cc0000",
                          "&:hover": {
                            backgroundColor: "rgba(204, 0, 0, 0.1)",
                          },
                        }}
                      >
                        Excluir
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  Nenhuma história encontrada.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default UserStoryTab;
