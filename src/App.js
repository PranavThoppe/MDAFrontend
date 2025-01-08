import React, { useState } from 'react';
import axios from 'axios';
import './App.css'; // Import the CSS file
import StockDetails from './StockDetails'; // Assuming this component will show detailed stock information

const HomePage = () => {
  const [tickers, setTickers] = useState('');
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [selectedStock, setSelectedStock] = useState(null); // State to track selected stock

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!tickers) {
      setError('Please enter at least one ticker symbol.');
      setResults(null);
      return;
    }

    setError(null); // Clear previous errors
    try {
      console.log(tickers);
      const response = await axios.get(
        `https://moving-average-flask-app.vercel.app/api/stock-analysis/${tickers}`
      );
      console.log(response.data);
      setResults(response.data);
    } catch (err) {
      setError('Failed to fetch data. Please try again.');
      setResults(null);
    }
  };

  const handleStockClick = (ticker) => {
    // Set the selected stock when the user clicks on the ticker card
    setSelectedStock(ticker);
  };

  return (
    <div className="container">
      <h1 className="title">Moving Average Analysis</h1>
      <form onSubmit={handleSubmit} className="form">
        <label htmlFor="tickers" className="label">
          Enter ticker symbols (comma-separated):
        </label>
        <input
          type="text"
          id="tickers"
          value={tickers}
          onChange={(e) => setTickers(e.target.value)}
          placeholder="e.g., AAPL, GOOG, TSLA"
          className="input"
        />
        <button type="submit" className="button">
          Analyze
        </button>
      </form>

      {error && <p className="error">{error}</p>}

      {results && (
        <div className="results">
          <h2 className="resultsTitle">Results</h2>
          {results.data &&
            Object.keys(results.data).length > 0 &&
            Object.entries(results.data).map(([ticker, data]) => {
              const isMA8Greater = data.MA8 > data.MA50;
              const isMA50Greater = data.MA50 > data.MA8;

              let recommendation = 'Recommendation: Buy';
              if (isMA8Greater) {
                recommendation = 'Recommendation: Buy';
              } else if (isMA50Greater) {
                recommendation = 'Recommendation: Sell';
              }

              return (
                <div
                  key={ticker}
                  className="tickerCard"
                  onClick={() => handleStockClick(ticker)} // Add onClick handler
                >
                  <div className="tickerContent">
                    <div>
                      <strong>{ticker}</strong>
                      <p
                        style={{
                          color:
                            isMA8Greater || data.MA8 === data.MA50
                              ? 'green'
                              : 'black',
                        }}
                      >
                        8-Day Moving Average: {data.MA8}
                      </p>
                      <p
                        style={{
                          color: isMA50Greater ? 'red' : 'black',
                        }}
                      >
                        50-Day Moving Average: {data.MA50}
                      </p>
                    </div>
                    {recommendation && (
                      <p
                        style={{
                          fontWeight: 'bold',
                          color: isMA8Greater ? 'green' : 'red',
                        }}
                      >
                        {recommendation}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
        </div>
      )}

      {selectedStock && (
        <div className="stockDetails">
          <h3>Selected Stock: {selectedStock}</h3>
          {/* Assuming you have a StockDetails component */}
          <StockDetails ticker={selectedStock} />
        </div>
      )}
    </div>
  );
};

const App = () => {
  return <HomePage />;
};

export default App;
