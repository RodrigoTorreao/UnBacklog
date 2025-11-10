import React, { useEffect, useState } from "react";
import { Header } from "../../components/Header";
import { Tab, Tabs } from "@mui/material";
import styles from "./ProjectPage.module.css";
import { useProject } from "../../context/ProjectContext";
import OverviewTab from "../../components/OverviewTab";
import UserStoryTab from "../../components/UserStoryTab";
import { getUserStory } from "../../api/projectApi";

const tabMap: Map<string, number> = new Map([
  ["OVERVIEW", 0],
  ["USER_STORIES", 1],
  ["SPRINTS", 2],
  ["KANBAN", 3],
]);

const ProjectPage: React.FC = () => {
  const { project, setProject } = useProject();
  const [selectedTab, setSelectedTab] = useState(tabMap.get("OVERVIEW"));

  useEffect(() => {
    const fetchUserStory = async () => {
      if (!project.id) {
        console.error("Cannot fetch user story: project ID is undefined");
        return;
      }
      try {
        const response = await getUserStory(project.id);
        setProject({
          ...project,
          userStories: response.data,
        });
      } catch (error) {
        alert("Erro ao buscar user stories");
      }
    };

    fetchUserStory();
  }, [project.id]);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  const renderTabContent = () => {
    switch (selectedTab) {
      case tabMap.get("OVERVIEW"):
        return <OverviewTab />;
      case tabMap.get("USER_STORIES"):
        return <UserStoryTab />;
      default:
        return <h1>Ola</h1>;
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
