import React, { useState } from 'react';
import axios from 'axios';

const App = () => {
  const [tickers, setTickers] = useState('');
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!tickers) {
      setError('Please enter at least one ticker symbol.');
      setResults(null);
      return;
    }

    setError(null); // Clear previous errors
    console.log(tickers);
    const response = await axios.get(`http://moving-average-flask-app.vercel.app/api/stock-analysis/${tickers}`);
    console.log(response.data);
    setResults(response.data);
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Moving Average Analysis</h1>
      <form onSubmit={handleSubmit} style={styles.form}>
        <label htmlFor="tickers" style={styles.label}>
          Enter ticker symbols (comma-separated):
        </label>
        <input
          type="text"
          id="tickers"
          value={tickers}
          onChange={(e) => setTickers(e.target.value)}
          placeholder="e.g., AAPL, GOOG, TSLA"
          style={styles.input}
        />
        <button type="submit" style={styles.button}>
          Analyze
        </button>
      </form>

      {error && <p style={styles.error}>{error}</p>}

      {results && (
        <div style={styles.results}>
          <h2 style={styles.resultsTitle}>Results</h2>
          
          {/* Show successful tickers */}
          {results.data && Object.keys(results.data).length > 0 && (
            <div style={styles.successSection}>
              <h3 style={styles.sectionTitle}>Successful Tickers</h3>
              {Object.entries(results.data).map(([ticker, data]) => {
                const isMA8Greater = data.MA8 > data.MA50;
                const isMA50Greater = data.MA50 > data.MA8;

                let recommendation = '';
                if (isMA8Greater) {
                  recommendation = 'Recommendation: Buy';
                } else if (isMA50Greater) {
                  recommendation = 'Recommendation: Sell';
                }

                return (
                  <div key={ticker} style={styles.tickerCard}>
                    <div style={styles.tickerContent}>
                      <div>
                        <strong>{ticker}</strong>
                        <p style={{ color: isMA8Greater || data.MA8 === data.MA50 ? 'green' : 'black' }}>
                          8-Day Moving Average: {data.MA8}
                        </p>
                        <p style={{ color: isMA50Greater ? 'red' : 'black' }}>
                          50-Day Moving Average: {data.MA50}
                        </p>
                      </div>
                      {recommendation && (
                        <p style={{ fontWeight: 'bold', color: isMA8Greater ? 'green' : 'red' }}>
                          {recommendation}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}



            </div>
          )}

          {/* Show error tickers */}
          {results.errors && results.errors.length > 0 && (
            <div style={styles.errorSection}>
              <h3 style={styles.sectionTitle}>Errors</h3>
              <p>Some errors occurred while fetching data:</p>
              <ul style={styles.errorList}>
                {results.errors.map((err, index) => (
                  <li key={index}>
                    <strong>{err.ticker}</strong>: {err.error}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: '40px',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#f4f7fc',
    borderRadius: '8px',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
    maxWidth: '800px',
    margin: '0 auto',
  },
  title: {
    textAlign: 'center',
    fontSize: '32px',
    color: '#333',
    marginBottom: '20px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: '20px',
  },
  label: {
    fontSize: '16px',
    color: '#555',
    marginBottom: '10px',
  },
  input: {
    padding: '10px',
    width: '100%',
    maxWidth: '350px',
    marginBottom: '20px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    fontSize: '16px',
  },
  button: {
    padding: '10px 20px',
    backgroundColor: '#007BFF',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  buttonHover: {
    backgroundColor: '#0056b3',
  },
  error: {
    color: 'red',
    textAlign: 'center',
  },
  results: {
    marginTop: '30px',
  },
  resultsTitle: {
    fontSize: '24px',
    color: '#333',
  },
  successSection: {
    marginBottom: '20px',
  },
  sectionTitle: {
    fontSize: '20px',
    color: '#333',
    marginBottom: '10px',
  },
  tickerCard: {
    backgroundColor: '#ffffff',
    padding: '15px',
    borderRadius: '6px',
    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
    marginBottom: '15px',
  },
  tickerContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  errorSection: {
    marginTop: '20px',
  },
  errorList: {
    listStyleType: 'none',
    paddingLeft: '0',
  },
};

export default App;
