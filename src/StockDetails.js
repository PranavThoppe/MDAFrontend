import React from 'react';

const StockDetails = ({ ticker }) => {
  // Check if ticker prop exists
  if (!ticker) {
    return null;
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Stock Details for {ticker}</h1>
      <div style={styles.detailsSection}>
        <h2 style={styles.subtitle}>Additional Information</h2>
        <div style={styles.infoCard}>
          <p>Company Profile</p>
          <p>Market Data</p>
          {/* Add more stock details here */}
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#f5f5f5',
    borderRadius: '8px',
    margin: '20px 0'
  },
  title: {
    fontSize: '24px',
    color: '#333',
    marginBottom: '20px'
  },
  subtitle: {
    fontSize: '18px',
    color: '#666',
    marginBottom: '15px'
  },
  detailsSection: {
    backgroundColor: '#fff',
    padding: '15px',
    borderRadius: '6px'
  },
  infoCard: {
    border: '1px solid #ddd',
    padding: '15px',
    borderRadius: '4px'
  }
};

export default StockDetails;