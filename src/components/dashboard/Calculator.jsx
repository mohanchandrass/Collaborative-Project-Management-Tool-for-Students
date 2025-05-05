import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ScientificCalculator = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const navigate = useNavigate();

  const handleInput = (value) => {
    setInput((prevInput) => prevInput + value);
  };

  const handleEvaluate = () => {
    try {
      // eslint-disable-next-line no-eval
      setOutput(eval(input));
    } catch (error) {
      setOutput('Error');
    }
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
  };

  const handleDelete = () => {
    setInput(input.slice(0, -1));
  };

  const handleScientificFunction = (func) => {
    if (func === 'Math.PI') {
      setInput((prev) => prev + Math.PI.toFixed(8));
    } else if (func.includes('Math.pow')) {
      setInput((prev) => `Math.pow(${prev},2)`);
    } else {
      setInput((prev) => `${func}(${prev})`);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div style={styles.container}>
      <button onClick={handleBack} style={styles.backButton}>⬅ Back</button>
      <h2 style={styles.title}>🧮 Scientific Calculator</h2>

      <div style={styles.display}>
        <input
          type="text"
          value={input}
          readOnly
          style={styles.input}
          placeholder="0"
        />
        <div style={styles.output}>{output}</div>
      </div>

      <div style={styles.buttons}>
        <div style={styles.row}>
          <button style={styles.button} onClick={() => handleInput('7')}>7</button>
          <button style={styles.button} onClick={() => handleInput('8')}>8</button>
          <button style={styles.button} onClick={() => handleInput('9')}>9</button>
          <button style={styles.button} onClick={() => handleInput('/')}>÷</button>
        </div>
        <div style={styles.row}>
          <button style={styles.button} onClick={() => handleInput('4')}>4</button>
          <button style={styles.button} onClick={() => handleInput('5')}>5</button>
          <button style={styles.button} onClick={() => handleInput('6')}>6</button>
          <button style={styles.button} onClick={() => handleInput('*')}>×</button>
        </div>
        <div style={styles.row}>
          <button style={styles.button} onClick={() => handleInput('1')}>1</button>
          <button style={styles.button} onClick={() => handleInput('2')}>2</button>
          <button style={styles.button} onClick={() => handleInput('3')}>3</button>
          <button style={styles.button} onClick={() => handleInput('-')}>−</button>
        </div>
        <div style={styles.row}>
          <button style={styles.button} onClick={() => handleInput('0')}>0</button>
          <button style={styles.button} onClick={() => handleInput('.')}>.</button>
          <button style={styles.button} onClick={handleEvaluate}>=</button>
          <button style={styles.button} onClick={() => handleInput('+')}>+</button>
        </div>

        <div style={styles.row}>
          <button style={styles.button} onClick={handleClear}>C</button>
          <button style={styles.button} onClick={handleDelete}>Del</button>
        </div>

        <div style={styles.row}>
          <button style={styles.button} onClick={() => handleScientificFunction('Math.sin')}>sin</button>
          <button style={styles.button} onClick={() => handleScientificFunction('Math.cos')}>cos</button>
          <button style={styles.button} onClick={() => handleScientificFunction('Math.tan')}>tan</button>
          <button style={styles.button} onClick={() => handleScientificFunction('Math.sqrt')}>√</button>
        </div>
        <div style={styles.row}>
          <button style={styles.button} onClick={() => handleScientificFunction('Math.pow')}>x²</button>
          <button style={styles.button} onClick={() => handleScientificFunction('Math.log10')}>log</button>
          <button style={styles.button} onClick={() => handleScientificFunction('Math.exp')}>exp</button>
          <button style={styles.button} onClick={() => handleScientificFunction('Math.PI')}>π</button>
        </div>
      </div>
    </div>
  );
};

export default ScientificCalculator;

const styles = {
  container: {
    padding: '2rem',
    maxWidth: '440px',
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
    marginBottom: '1rem',
  },
  display: {
    textAlign: 'center',
    marginBottom: '1rem',
  },
  input: {
    width: '100%',
    padding: '1rem',
    fontSize: '1.5rem',
    backgroundColor: '#2c2c3b',
    border: '1px solid #555',
    color: '#fff',
    borderRadius: '8px',
    marginBottom: '0.5rem',
  },
  output: {
    fontSize: '1.3rem',
    color: '#4cd137',
    fontWeight: 'bold',
    minHeight: '1.5rem',
  },
  buttons: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  row: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '0.5rem',
  },
  button: {
    flex: 1,
    padding: '1rem',
    fontSize: '1.2rem',
    borderRadius: '8px',
    backgroundColor: '#3b3b4f',
    color: '#fff',
    border: 'none',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
};
