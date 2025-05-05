import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pie, Bar, Line, Doughnut, Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  LineElement,
  PointElement,
  RadialLinearScale,
  DoughnutController,
  LineController,
  RadarController,
} from 'chart.js';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  RadialLinearScale,
  DoughnutController,
  LineController,
  RadarController
);

const ChartGenerator = () => {
  const [chartType, setChartType] = useState('pie');
  const [labels, setLabels] = useState('');
  const [dataValues, setDataValues] = useState('');
  const [generatedChart, setGeneratedChart] = useState(null);

  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  const handleChartGeneration = () => {
    const parsedLabels = labels.split(',').map(label => label.trim());
    const parsedData = dataValues.split(',').map(value => parseFloat(value.trim()));

    if (parsedLabels.length !== parsedData.length) {
      alert('Number of labels must match the number of data values!');
      return;
    }

    const chartData = {
      labels: parsedLabels,
      datasets: [
        {
          label: 'Dataset',
          data: parsedData,
          backgroundColor: [
            '#00bfa6',
            '#ffc107',
            '#ff5252',
            '#2980b9',
            '#8e44ad',
            '#f39c12',
            '#1abc9c',
          ],
          borderWidth: 1,
        },
      ],
    };

    const chartOptions = {
      responsive: true,
      plugins: {
        legend: { position: 'bottom' },
        title: {
          display: true,
          text: 'Generated Chart',
          color: '#fff',
          font: { size: 18 },
        },
      },
      maintainAspectRatio: false,
    };

    setGeneratedChart({ data: chartData, options: chartOptions });
  };

  return (
    <div style={styles.container}>
      <button onClick={handleBack} style={styles.backButton}>
        ⬅ Back
      </button>
      <h2 style={styles.heading}>Chart Generator</h2>

      <div style={styles.formContainer}>
        <div style={styles.inputGroup}>
          <label htmlFor="chartType" style={styles.label}>Chart Type:</label>
          <select
            id="chartType"
            value={chartType}
            onChange={(e) => setChartType(e.target.value)}
            style={styles.input}
          >
            <option value="pie">Pie Chart</option>
            <option value="doughnut">Doughnut Chart</option>
            <option value="bar">Bar Chart</option>
            <option value="line">Line Chart</option>
            <option value="radar">Radar Chart</option>
          </select>
        </div>

        <div style={styles.inputGroup}>
          <label htmlFor="labels" style={styles.label}>Labels (comma separated):</label>
          <input
            type="text"
            id="labels"
            value={labels}
            onChange={(e) => setLabels(e.target.value)}
            style={styles.input}
            placeholder="e.g., Apple, Banana, Orange"
          />
        </div>

        <div style={styles.inputGroup}>
          <label htmlFor="dataValues" style={styles.label}>Data Values (comma separated):</label>
          <input
            type="text"
            id="dataValues"
            value={dataValues}
            onChange={(e) => setDataValues(e.target.value)}
            style={styles.input}
            placeholder="e.g., 50, 30, 20"
          />
        </div>

        <button onClick={handleChartGeneration} style={styles.generateButton}>
          🚀 Generate Chart
        </button>
      </div>

      <div style={styles.chartContainer}>
        {generatedChart ? (
          <>
            {chartType === 'pie' && <Pie data={generatedChart.data} options={generatedChart.options} />}
            {chartType === 'doughnut' && <Doughnut data={generatedChart.data} options={generatedChart.options} />}
            {chartType === 'bar' && <Bar data={generatedChart.data} options={generatedChart.options} />}
            {chartType === 'line' && <Line data={generatedChart.data} options={generatedChart.options} />}
            {chartType === 'radar' && <Radar data={generatedChart.data} options={generatedChart.options} />}
          </>
        ) : (
          <p style={styles.placeholderText}>Enter data above and click "Generate Chart"</p>
        )}
      </div>
    </div>
  );
};

export default ChartGenerator;

const styles = {
  
  container: {
    width: '100%',
    maxWidth: '800px',
    margin: '2rem auto',
    padding: '2rem',
    background: '#1e1e2f',
    color: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
    fontFamily: '"Segoe UI", sans-serif',
    boxSizing: 'border-box',
  },
  
  
  heading: {
    fontSize: '2rem',
    marginBottom: '1.5rem',
    textAlign: 'center',
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
  formContainer: {
    display: 'grid',
    gap: '1.2rem',
    marginBottom: '2rem',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    marginBottom: '0.5rem',
    fontWeight: '500',
    color: '#ccc',
  },
  input: {
    padding: '0.75rem',
    borderRadius: '8px',
    border: '1px solid #555',
    backgroundColor: '#2c2c3b',
    color: '#fff',
    fontSize: '1rem',
    transition: 'border-color 0.3s',
  },
  generateButton: {
    backgroundColor: '#3498db',
    color: '#fff',
    padding: '0.9rem',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  chartContainer: {
    marginTop: '2rem',
    height: '400px',
    backgroundColor: '#2b2b3c',
    padding: '1rem',
    borderRadius: '10px',
  },
  placeholderText: {
    textAlign: 'center',
    color: '#aaa',
  },
};
