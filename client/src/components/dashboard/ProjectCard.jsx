import React from 'react';

const ProjectCard = ({ project, onClick, onDelete }) => {
  return (
    <div
      className="bg-white shadow-lg rounded-lg p-4 flex flex-col"
      onClick={() => onClick(project)}
    >
      <h3 className="text-xl font-semibold">{project.name}</h3>
      <p className="text-sm text-gray-600">{project.description}</p>
      <div className="mt-2 flex justify-between items-center text-sm text-gray-500">
        <span>{project.status}</span>
        <button
          onClick={(e) => {
            e.stopPropagation(); // Prevent the modal from opening
            onDelete();
          }}
          className="text-red-500 hover:text-red-700"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default ProjectCard;
