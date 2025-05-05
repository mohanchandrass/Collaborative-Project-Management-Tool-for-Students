import React, { useEffect, useState } from 'react';
import { firestore } from '../../firebase';
import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where
} from 'firebase/firestore';
import { Link } from 'react-router-dom'; // ✅ Added Link import
import '../../styles/TaskStatus.css';

const TaskStatus = ({ groupId }) => {
  const [tasks, setTasks] = useState([]);
  const [taskCounts, setTaskCounts] = useState({
    toDo: 0,
    inProgress: 0,
    completed: 0,
  });
  const [newTaskName, setNewTaskName] = useState('');
  const [newTaskStatus, setNewTaskStatus] = useState('Not Started');
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(
        collection(firestore, 'groups', groupId, 'tasks'),
        where('groupId', '==', groupId)
      ),
      (querySnapshot) => {
        const loadedTasks = [];
        let counts = { toDo: 0, inProgress: 0, completed: 0 };

        querySnapshot.forEach((doc) => {
          const task = { id: doc.id, ...doc.data() };
          loadedTasks.push(task);

          if (task.status === 'Not Started') counts.toDo += 1;
          if (task.status === 'In Progress') counts.inProgress += 1;
          if (task.status === 'Completed') counts.completed += 1;
        });

        setTasks(loadedTasks);
        setTaskCounts(counts);
        setIsLoading(false);
      },
      (error) => {
        console.error('Error fetching tasks:', error);
        setErrorMessage('Failed to fetch tasks.');
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [groupId]);

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTaskName.trim()) return;

    try {
      await addDoc(collection(firestore, 'groups', groupId, 'tasks'), {
        name: newTaskName,
        status: newTaskStatus,
        groupId: groupId,
      });
      setNewTaskName('');
      setNewTaskStatus('Not Started');
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      const taskRef = doc(firestore, 'groups', groupId, 'tasks', id);
      await updateDoc(taskRef, { status });
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(firestore, 'groups', groupId, 'tasks', id));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  return (
    <div className="task-status-container">
      <h2 style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        Task Status
        <div className='view-chart-button'>
          {/* ✅ Updated from <a href> to <Link> */}
          <Link to={`/chart/${groupId}`}>
  <button>View Chart</button>
</Link>
        </div>
      </h2>

      {isLoading && <p>Loading task status...</p>}
      {errorMessage && <p className="error-message">{errorMessage}</p>}

      {/* Task Count Cards */}
      <div className="task-status-cards">
        <div className="task-card">
          <h4>Not Started</h4>
          <p>{taskCounts.toDo} Tasks</p>
        </div>
        <div className="task-card">
          <h4>In Progress</h4>
          <p>{taskCounts.inProgress} Tasks</p>
        </div>
        <div className="task-card">
          <h4>Completed</h4>
          <p>{taskCounts.completed} Tasks</p>
        </div>
      </div>

      <hr />

      {/* New Task Form */}
      <h3>Add New Task</h3>
      <form onSubmit={handleAddTask} className="add-task-form">
        <input
          type="text"
          placeholder="Enter task name"
          value={newTaskName}
          onChange={(e) => setNewTaskName(e.target.value)}
          required
        />
        <select
          value={newTaskStatus}
          onChange={(e) => setNewTaskStatus(e.target.value)}
        >
          <option value="Not Started">Not Started</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
        <button type="submit">Add Task</button>
      </form>

      {/* Task List */}
      <h3>Manage Tasks</h3>
      <div className="task-list">
        {tasks.map((task) => (
          <div key={task.id} className="task-item">
            <strong>{task.name}</strong>
            <select
              value={task.status}
              onChange={(e) => handleStatusChange(task.id, e.target.value)}
            >
              <option value="Not Started">Not Started</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
            <button onClick={() => handleDelete(task.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskStatus;
