import React, { useState } from "react";
import { useProject } from "../context/ProjectContext";
import ProjectMetrics from "./ProjectMetric";


const OverviewTab: React.FC = () => {
    const { project } = useProject();
    
    return (
        <div style={{ fontFamily: 'Inter, "Noto Sans", sans-serif'}}>
            <h2 color="#0c1d14">
                Visão Geral do Projeto: 
            </h2>
            <p>{project.description}</p>
            <h2 style={{marginTop: "55px"}}>Métricas chave:</h2>
            <div style={{display:"flex", flexDirection: "row", justifyContent: "space-between"}}>
                <ProjectMetrics name="Total de Stories" value={25}/>
                <ProjectMetrics name="Sprints Completas" value={5}/>
                <ProjectMetrics name="Membros da Equipe" value={8}/>
            </div>
        </div>
    );
}

export default OverviewTab;     