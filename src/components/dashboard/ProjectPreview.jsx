// dashboard/ProjectPreview.jsx
import React, { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { firestore } from '../../firebase';

const ProjectPreview = ({ groupId, userId }) => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const q = query(
      collection(firestore, 'projects'),
      where('groupId', '==', groupId),
      where('ownerId', '==', userId)
    );
    const unsub = onSnapshot(q, (snapshot) => {
      const projList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProjects(projList.slice(0, 3)); // Preview only 3
    });
    return () => unsub();
  }, [groupId, userId]);

  return (
    <div>
      <h3>Your Projects</h3>
      {projects.length === 0 ? <p>No projects yet.</p> : (
        <ul>
          {projects.map(project => (
            <li key={project.id}><strong>{project.title}</strong></li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ProjectPreview;
