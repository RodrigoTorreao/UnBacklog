import React, { useEffect, useState } from "react";
import { Header } from "../../components/Header";
import { Tab, Tabs } from "@mui/material";
import styles from "./ProjectPage.module.css";
import { useProject } from "../../context/ProjectContext";
import OverviewTab from "../../components/OverviewTab";
import UserStoryTab from "../../components/UserStoryTab";
import SprintsTab from "../../components/SprintsTab";
import { getUserStory, getSprints } from "../../api/projectApi";
import KanbanTab from "../../components/KanbanTab";

const tabMap: Map<string, number> = new Map([
  ["OVERVIEW", 0],
  ["USER_STORIES", 1],
  ["SPRINTS", 2],
  ["KANBAN", 3],
]);

const ProjectPage: React.FC = () => {
  const { project, updateUserStories, updateSprints } = useProject();
  const [selectedTab, setSelectedTab] = useState(tabMap.get("OVERVIEW"));
  const [hasLoadedStories, setHasLoadedStories] = useState(false);
  const [hasLoadedSprints, setHasLoadedSprints] = useState(false);

  useEffect(() => {
    const fetchUserStory = async () => {
      if (!project.id || hasLoadedStories) {
        return;
      }
      try {
        const response = await getUserStory(project.id);
        updateUserStories(response.data);
        setHasLoadedStories(true);
      } catch (error) {
        console.error("Erro ao buscar user stories:", error);
        alert("Erro ao buscar user stories");
      }
    };

    fetchUserStory();
  }, [project.id, hasLoadedStories, updateUserStories]);

  useEffect(() => {
    const fetchSprints = async () => {
      if (!project.id || hasLoadedSprints) {
        return;
      }
      try {
        const response = await getSprints(project.id);
        const formattedSprints = response.data.map((sprint: { sprintId: any; }) => ({
          ...sprint,
          id: sprint.sprintId
        }));
        updateSprints(formattedSprints);
        setHasLoadedSprints(true);
      } catch (error) {
        console.error("Erro ao buscar sprints:", error);
        alert("Erro ao buscar sprints");
      }
    };

    fetchSprints();
    console.log(project)
  }, [project.id, hasLoadedSprints, updateSprints]);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  const renderTabContent = () => {
    switch (selectedTab) {
      case tabMap.get("OVERVIEW"):
        return <OverviewTab />;
      case tabMap.get("USER_STORIES"):
        return <UserStoryTab />;
      case tabMap.get("SPRINTS"):
        return <SprintsTab />;
      case tabMap.get("KANBAN"):
        return <KanbanTab />;
      default:
        return <h1>Olá</h1>;
    }
  };

  return (
    <div style={{ fontFamily: 'Inter, "Noto Sans", sans-serif', color: "#0c1d14" }}>
      <Header />
      <div className={styles.main}>
        <h1
          style={{
            fontSize: "2.5em",
            marginLeft: "25px",
            marginBottom: "0.01em",
          }}
        >
          {`Projeto: ${project.name}`}
        </h1>

        <Tabs
          value={selectedTab}
          onChange={handleChange}
          aria-label="project tabs"
          sx={{
            borderBottom: "2px solid #e6f4ed",
            "& .MuiTab-root": {
              color: "#45a173",
              textTransform: "none",
              fontWeight: 500,
              fontSize: "1rem",
              minWidth: "120px",
              transition: "color 0.2s ease",
              "&:hover": {
                color: "#006633",
              },
            },
            "& .Mui-selected": {
              color: "#006633 !important",
            },
            "& .MuiTabs-indicator": {
              backgroundColor: "#006633",
            },
            "& .MuiTabs-flexContainer": {
              gap: "35px",
            },
          }}
        >
          <Tab label="Overview" />
          <Tab label="User Stories" />
          <Tab label="Sprints" />
          <Tab label="Kanban" />
        </Tabs>

        <div>{renderTabContent()}</div>
      </div>
    </div>
  );
};

export default ProjectPage;