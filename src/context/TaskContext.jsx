import React, { createContext, useState, useContext, useEffect } from 'react';
import { ProjectContext } from './ProjectContext';
import { fetchTasks, createTask as apiCreateTask, updateTask as apiUpdateTask } from '../services/tasks';

export const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const { currentProject } = useContext(ProjectContext);

  useEffect(() => {
    if (currentProject) {
      loadTasks();
    }
  }, [currentProject]);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const projectTasks = await fetchTasks(currentProject.id);
      setTasks(projectTasks);
      setLoading(false);
    } catch (error) {
      console.error('Error loading tasks:', error);
      setLoading(false);
    }
  };

  const createTask = async (taskData) => {
    try {
      const newTask = await apiCreateTask(currentProject.id, taskData);
      setTasks([...tasks, newTask]);
      return newTask;
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  };

  const updateTask = async (taskId, updates) => {
    try {
      const updatedTask = await apiUpdateTask(taskId, updates);
      setTasks(tasks.map(task => 
        task.id === taskId ? updatedTask : task
      ));
      return updatedTask;
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        loading,
        createTask,
        updateTask,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};