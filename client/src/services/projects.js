const API_URL = 'http://localhost:5000/api';

export const fetchProjects = async (userId) => {
  const response = await fetch(`${API_URL}/projects?userId=${userId}`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch projects');
  }

  return await response.json();
};

export const createProject = async (userId, name) => {
  const response = await fetch(`${API_URL}/projects`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify({ userId, name }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to create project');
  }

  return await response.json();
};

export const joinProject = async (userId, code) => {
  const response = await fetch(`${API_URL}/projects/join`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify({ userId, code }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to join project');
  }

  return await response.json();
};