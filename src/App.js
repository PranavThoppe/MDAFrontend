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
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Stock Analysis</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="tickers">Enter ticker symbols (comma-separated):</label>
        <input
          type="text"
          id="tickers"
          value={tickers}
          onChange={(e) => setTickers(e.target.value)}
          placeholder="e.g., AAPL, GOOG, TSLA"
          style={{ marginLeft: '10px', padding: '5px', width: '300px' }}
        />
        <button type="submit" style={{ marginLeft: '10px', padding: '5px 10px' }}>
          Analyze
        </button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {results && (
        <div style={{ marginTop: '20px' }}>
          <h2>Results</h2>
          
          {/* Show successful tickers */}
          {results.data && Object.keys(results.data).length > 0 && (
            <div>
              <h3>Successful Tickers</h3>
              {Object.entries(results.data).map(([ticker, data]) => (
                <div key={ticker} style={{ marginBottom: '10px' }}>
                  <strong>{ticker}</strong>
                  <p>8-Day Moving Average: {data.MA8}</p>
                  <p>50-Day Moving Average: {data.MA50}</p>
                </div>
              ))}
            </div>
          )}

          {/* Show error tickers */}
          {results.errors && results.errors.length > 0 && (
            <div>
              <h3>Errors</h3>
              <p>Some errors occurred while fetching data:</p>
              <ul>
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

export default App;
