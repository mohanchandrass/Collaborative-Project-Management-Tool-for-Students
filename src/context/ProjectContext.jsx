import React, { createContext, useState, useContext, useEffect } from 'react';
import { AuthContext } from './AuthContext';
import { fetchProjects, createProject as apiCreateProject, joinProject as apiJoinProject } from '../services/projects';

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
      setLoading(false);
    } catch (error) {
      console.error('Error loading projects:', error);
      setLoading(false);
    }
  };

  const createProject = async (name) => {
    try {
      const newProject = await apiCreateProject(user.id, name);
      setProjects([...projects, newProject]);
      return newProject;
    } catch (error) {
      console.error('Error creating project:', error);
      throw error;
    }
  };

  const joinProject = async (code) => {
    try {
      const project = await apiJoinProject(user.id, code);
      setProjects([...projects, project]);
      return project;
    } catch (error) {
      console.error('Error joining project:', error);
      throw error;
    }
  };

  const selectProject = (projectId) => {
    const project = projects.find(p => p.id === projectId);
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