import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [serverData, setServerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const checkConnection = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:5000/api');
      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }
      const data = await response.json();
      setServerData(data);
    } catch (err) {
      setError('Unable to reach server. Make sure the backend is running on port 5000.');
      setServerData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkConnection();
  }, []);

  return (
    <div className="container">
      <div className="card">
        <h1>GreenCharge AI</h1>
        <p className="subtitle">React + Node.js Express Connection</p>

        <div className="status-box">
          <div className="status-indicator">
            <span className={`dot ${serverData ? 'online' : 'offline'}`}></span>
            <strong>
              {loading
                ? 'Connecting to Server...'
                : serverData
                  ? 'Connected to Server'
                  : 'Server Disconnected'}
            </strong>
          </div>

          {serverData && (
            <div className="server-info">
              <p className="message">{serverData.message}</p>
              <div className="details">
                <span>Port: <strong>{serverData.port}</strong></span>
                <span>Time: <strong>{serverData.timestamp}</strong></span>
              </div>
            </div>
          )}

          {error && <p className="error-text">{error}</p>}
        </div>

        <button className="btn" onClick={checkConnection} disabled={loading}>
          {loading ? 'Checking...' : 'Check Server Again'}
        </button>
      </div>
    </div>
  );
}

export default App;
