// dashboard/TaskStatusPreview.jsx
import React, { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { firestore } from '../../firebase';

const TaskStatusPreview = ({ groupId }) => {
  const [counts, setCounts] = useState({ toDo: 0, inProgress: 0, completed: 0 });

  useEffect(() => {
    const q = query(collection(firestore, 'tasks'), where('groupId', '==', groupId));
    const unsub = onSnapshot(q, (snapshot) => {
      let c = { toDo: 0, inProgress: 0, completed: 0 };
      snapshot.forEach(doc => {
        const task = doc.data();
        if (task.status === 'Not Started') c.toDo++;
        else if (task.status === 'In Progress') c.inProgress++;
        else if (task.status === 'Completed') c.completed++;
      });
      setCounts(c);
    });
    return () => unsub();
  }, [groupId]);

  return (
    <div>
      <h3>Task Summary</h3>
      <ul>
        <li>🕐 Not Started: {counts.toDo}</li>
        <li>⚙️ In Progress: {counts.inProgress}</li>
        <li>✅ Completed: {counts.completed}</li>
      </ul>
    </div>
  );
};

export default TaskStatusPreview;
