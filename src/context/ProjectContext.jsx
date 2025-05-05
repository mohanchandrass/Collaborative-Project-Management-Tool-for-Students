import React, { createContext, useState, useContext, useEffect } from 'react';
import { AuthContext } from './AuthContext';
import {
  fetchProjects,
  createProject as apiCreateProject,
  joinProject as apiJoinProject,
} from '../services/projects';

export const ProjectContext = createContext();

export const ProjectProvider = ({ children }) => {
  const [projects, setProjects] = useState([]);
  const [currentProject, setCurrentProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (user) {
      loadProjects();
    }
  }, [user]);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const userProjects = await fetchProjects(user.id);
      setProjects(userProjects);

      // ✅ Auto-select the first available project
      if (userProjects.length > 0) {
        setCurrentProject(userProjects[0]);
      }

      setLoading(false);
    } catch (error) {
      console.error('Error loading projects:', error);
      setLoading(false);
    }
  };

  const createProject = async (name) => {
    try {
      const newProject = await apiCreateProject(user.id, name);
      const updatedProjects = [...projects, newProject];
      setProjects(updatedProjects);

      // Optionally auto-select the newly created project
      setCurrentProject(newProject);

      return newProject;
    } catch (error) {
      console.error('Error creating project:', error);
      throw error;
    }
  };

  const joinProject = async (code) => {
    try {
      const project = await apiJoinProject(user.id, code);
      const updatedProjects = [...projects, project];
      setProjects(updatedProjects);

      // Optionally auto-select the joined project
      setCurrentProject(project);

      return project;
    } catch (error) {
      console.error('Error joining project:', error);
      throw error;
    }
  };

  const selectProject = (projectId) => {
    const project = projects.find((p) => p.id === projectId);
    setCurrentProject(project);
  };

  return (
    <ProjectContext.Provider
      value={{
        projects,
        currentProject,
        loading,
        createProject,
        joinProject,
        selectProject,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};
