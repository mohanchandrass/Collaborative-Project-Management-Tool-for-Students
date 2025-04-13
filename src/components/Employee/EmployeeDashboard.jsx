import React, { useState, useEffect } from "react";
import "./EmployeeDashboard.css";
import { IconButton } from "@material-ui/core";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import axios from "axios";
import TaskBoard from "./TaskBoard/TaskBoard";
import Profile from "./Profile/Profile";
import YourProject from "./Project/YourProject";
import Dashboard from "./Dashboard/Dashboard";

const EmployeeDashboard = () => {
  const [menuItemSelected, setMenuItemSelected] = useState("tasks");
  const [employee, setEmployee] = useState({});
  const [tasks, setTasks] = useState([]);
  const [loggedInEmployeeId, setLoggedInEmployeeId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      axios
        .get("http://localhost:5000/api/employees/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setEmployee(response.data);
          setLoggedInEmployeeId(response.data._id); // Assuming the employee ID is stored in _id
          console.log("Profile data:", response.data);
        })
        .catch((error) => console.error("Error fetching profile:", error));

      axios
        .get("http://localhost:5000/api/tasks", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setTasks(response.data);
          console.log("Tasks data:", response.data);
        })
        .catch((error) => console.error("Error fetching tasks:", error));
    } else {
      console.error("No token found");
    }
  }, []);

  const handleTaskStatusChange = (taskId, newStatus) => {
    const token = localStorage.getItem("token");
    axios
      .put(
        `http://localhost:5000/api/tasks/${taskId}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        const updatedTask = response.data;
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task._id === updatedTask._id ? updatedTask : task
          )
        );
      })
      .catch((error) => console.error("Error updating task status:", error));
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  let content = null;
  switch (menuItemSelected) {
    case "profile":
      content = <Profile employee={employee} />;
      break;
    case "tasks":
      content = (
        <TaskBoard tasks={tasks} onTaskStatusChange={handleTaskStatusChange} />
      );
      break;
    case "milestone":
      content = (
        <div>
          <h2>Today's Milestone</h2>
          <p>
            Your dedication to goal attainment is a driving force behind our
            success. <br /> "With each milestone reached, you paint a vivid
            picture of dedication and achievement. Your commitment to specific
            goal attainment is a source of pride."
          </p>
        </div>
      );
      break;
    case "yourProject":
      content = <YourProject loggedInEmployeeId={loggedInEmployeeId} />;
      break;
    case "dashboard":
      content = <Dashboard />;
      break;
    default:
      content = (
        <div>
          <h2>Welcome</h2>
          <p>Select a menu item to view content.</p>
        </div>
      );
  }

  return (
    <div className="dashboard-container">
      <Navbar
        handleLogout={handleLogout}
        setMenuItemSelected={setMenuItemSelected}
      />
      <div className="main-content">
        <Sidebar setMenuItemSelected={setMenuItemSelected} />
        <div className="dashboard-content">{content}</div>
      </div>
    </div>
  );
};

const Navbar = ({ handleLogout, setMenuItemSelected }) => (
  <div className="navbar">
    <div className="logo">Agile</div>
    <div className="nav-items">
      <button onClick={() => setMenuItemSelected("yourProject")}>
        Your Project
      </button>
      <button onClick={() => setMenuItemSelected("dashboard")}>
        Dashboards
      </button>
      <button>Search</button>
      <input type="text" placeholder="Search" />
      <button className="bell">🔔</button>
      <IconButton
        edge="end"
        color="inherit"
        aria-label="logout"
        onClick={handleLogout}
      >
        <ExitToAppIcon />
      </IconButton>
    </div>
  </div>
);

const Sidebar = ({ setMenuItemSelected }) => (
  <div className="sidebar">
    <button onClick={() => setMenuItemSelected("profile")}>Profile</button>
    <button onClick={() => setMenuItemSelected("tasks")}>Tasks</button>
    <button onClick={() => setMenuItemSelected("milestone")}>Milestone</button>
    <button onClick={() => setMenuItemSelected("epic")}>Epic</button>
    <button onClick={() => setMenuItemSelected("userStories")}>
      User Stories
    </button>
  </div>
);

export default EmployeeDashboard;
