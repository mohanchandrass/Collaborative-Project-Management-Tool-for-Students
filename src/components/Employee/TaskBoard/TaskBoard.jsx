import React from "react";
import "./TaskBoard.css";

const TaskBoard = ({ tasks, onTaskStatusChange }) => {
  const inProgressTasks = tasks.filter((task) => task.status === "In Progress");
  const completedTasks = tasks.filter((task) => task.status === "Done");
  const pendingTasks = tasks.filter(
    (task) => task.status !== "In Progress" && task.status !== "Done"
  );

  return (
    <div className="task-board">
      <h2>Task Board</h2>
      <div className="columns">
        <div className="column">
          <h3>Pending Tasks</h3>
          {pendingTasks.map((task) => (
            <div key={task._id} className="task">
              <h4>Title: {task.title}</h4>
              <p>Priority: {task.priority}</p>
              <button
                className="task-button do-it-now"
                onClick={() => onTaskStatusChange(task._id, "In Progress")}
              >
                Do It Now
              </button>
            </div>
          ))}
        </div>
        <div className="column">
          <h3>In Progress</h3>
          {inProgressTasks.map((task) => (
            <div key={task._id} className="task">
              <h4>Title: {task.title}</h4>
              <p>Priority: {task.priority}</p>
              <button
                className="task-button done"
                onClick={() => onTaskStatusChange(task._id, "Done")}
              >
                Done
              </button>
            </div>
          ))}
        </div>
        <div className="column">
          <h3>Completed Tasks</h3>
          {completedTasks.map((task) => (
            <div key={task._id} className="task">
              <h4>Title: {task.title}</h4>
              <p>Priority: {task.priority}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TaskBoard;
