// src/components/Dashboard/Dashboard.jsx
import React from "react";
import "./Dashboard.css"; // Create this CSS file to style Dashboard component

const Dashboard = () => {
  const handleCommunication = () => {
    // Add your logic here to handle communication with the manager
    alert("Communicating with the manager");
  };

  return (
    <div className="dashboard">
      <h2>Dashboard</h2>
      <p>
        Welcome to your dashboard. Here, you can view your projects, tasks, and
        communicate with your manager.
      </p>

      <div className="box">
        <h3>Project Management Guidelines</h3>
        <ul>
          <li>Define clear project objectives</li>
          <li>Assign tasks and responsibilities</li>
          <li>Set realistic deadlines</li>
          <li>Regularly communicate with team members</li>
          <li>Monitor progress and make adjustments as needed</li>
        </ul>
      </div>

      <div className="box">
        <h3>Company Guidelines</h3>
        <ul>
          <li>Adhere to company policies and procedures</li>
          <li>Respect colleagues and diversity</li>
          <li>Maintain a professional attitude</li>
          <li>Contribute positively to the company culture</li>
        </ul>
      </div>

      <button onClick={handleCommunication}>Communicate with Manager</button>
      {/* Add more content and structure as needed */}
    </div>
  );
};

export default Dashboard;
