import React, { useEffect, useState } from "react";
import axios from "axios";
import "./YourProject.css"; // Ensure this CSS file is created and styled

const YourProject = () => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No token found");
        }

        const response = await axios.get(`http://localhost:5000/api/projects`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProjects(response.data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    fetchProjects();
  }, []);

  return (
    <div className="your-project">
      <h2>Your Projects</h2>
      {projects.length > 0 ? (
        <ul>
          {projects.map((project) => (
            <li key={project._id}>
              <h3>{project.projectName}</h3>
              <p>{project.description}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No projects found.</p>
      )}
    </div>
  );
};

export default YourProject;
