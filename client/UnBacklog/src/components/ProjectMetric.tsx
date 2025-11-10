import React, { useState } from "react";

interface ProjectMetricsProps{
    name:string;
    value:number;
}

const ProjectMetrics: React.FC<ProjectMetricsProps>= ({name, value}) => {

    return(
        <div style={{border:"2px solid #e6f4ed", borderRadius:"10px", width:"30em", height: "10em", paddingLeft: "2em",alignContent:"center"}}>
            <p style={{fontSize:"x-large"}}>{name}</p>
            <p style={{marginTop: "3px",fontSize:"xxx-large", fontWeight:"bolder"}}>{value}</p>

        </div>
    );
}

export default ProjectMetrics; 