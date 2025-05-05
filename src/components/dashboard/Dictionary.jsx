import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Dictionary = () => {
  const [word, setWord] = useState('');
  const [definition, setDefinition] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1); // Navigates to previous page
  };

  const fetchDefinition = async () => {
    if (!word.trim()) {
      setError('Please enter a word to search.');
      setDefinition('');
      return;
    }

    setError('');
    setDefinition('');

    try {
      const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
      const data = await response.json();

      if (data && Array.isArray(data) && data[0]?.meanings?.length > 0) {
        const meanings = data[0].meanings
          .flatMap(meaning => meaning.definitions.map(def => def.definition))
          .slice(0, 3) // Show first 3 definitions
          .join(', ');
        setDefinition(meanings);
      } else {
        setError('Word not found.');
      }
    } catch (err) {
      setError('Error fetching data.');
    }
  };

  return (
    <div style={styles.container}>
      <button onClick={handleBack} style={styles.backButton}>⬅ Back</button>
      <h2 style={styles.title}>📖 Dictionary</h2>

      <div style={styles.searchSection}>
        <input
          type="text"
          value={word}
          onChange={(e) => setWord(e.target.value)}
          placeholder="Enter a word"
          style={styles.input}
        />
        <button onClick={fetchDefinition} style={styles.button}>Search</button>
      </div>

      {error && <p style={styles.error}>{error}</p>}

      {definition && (
        <div style={styles.definitionSection}>
          <h4 style={styles.definitionTitle}>Definition:</h4>
          <p>{definition}</p>
        </div>
      )}
    </div>
  );
};

export default Dictionary;

const styles = {
  container: {
    padding: '2rem',
    maxWidth: '500px',
    margin: '2rem auto',
    background: '#1e1e2f',
    borderRadius: '12px',
    color: '#ffffff',
    fontFamily: '"Segoe UI", sans-serif',
    boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
  },
  backButton: {
    background: '#444',
    color: '#fff',
    padding: '0.5rem 1rem',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    marginBottom: '1.5rem',
    transition: 'background 0.3s ease',
  },
  title: {
    textAlign: 'center',
    fontSize: '1.8rem',
    marginBottom: '2rem',
  },
  searchSection: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '1rem',
  },
  input: {
    flex: 1,
    padding: '0.75rem',
    fontSize: '1rem',
    backgroundColor: '#2c2c3b',
    border: '1px solid #555',
    color: '#fff',
    borderRadius: '8px',
  },
  button: {
    padding: '0.75rem 1rem',
    backgroundColor: '#3498db',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  error: {
    color: 'red',
    marginTop: '1rem',
    textAlign: 'center',
  },
  definitionSection: {
    marginTop: '1.5rem',
    padding: '1rem',
    backgroundColor: '#2c2c3b',
    borderRadius: '8px',
    lineHeight: '1.5',
  },
  definitionTitle: {
    fontSize: '1.2rem',
    fontWeight: '600',
    marginBottom: '0.5rem',
  },
};
