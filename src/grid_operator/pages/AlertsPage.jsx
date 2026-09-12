import React, { useState } from 'react';
import { analyticsAlertsData } from '../services/gridData.js';

export default function AlertsPage() {
  const [filterSeverity, setFilterSeverity] = useState('All');
  const alerts = analyticsAlertsData.recentAlerts;

  const filteredAlerts = filterSeverity === 'All'
    ? alerts
    : alerts.filter((a) => a.severity === filterSeverity);

  return (
    <div className="grid-page-content alerts-page">
      <div className="grid-filter-toolbar">
        <div className="filter-control-group">
          <span className="filter-label">Filter Severity</span>
          <select
            value={filterSeverity}
            onChange={(e) => setFilterSeverity(e.target.value)}
            className="filter-select"
          >
            <option value="All">All Severities</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
      </div>

      <div className="grid-card">
        <div className="card-header-clean">
          <div>
            <h3 className="card-title">Grid Operations Alerts Center</h3>
            <p className="card-subtitle">Real-time alerts, notifications and contingency logs.</p>
          </div>
        </div>

        <div className="grid-table-wrap">
          <table className="grid-table">
            <thead>
              <tr>
                <th>Time</th>
                <th>Type</th>
                <th>Message</th>
                <th>Severity</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredAlerts.map((alert) => (
                <tr key={alert.id}>
                  <td style={{ whiteSpace: 'nowrap', color: '#64748B' }}>{alert.time}</td>
                  <td style={{ fontWeight: 600 }}>{alert.type}</td>
                  <td>{alert.message}</td>
                  <td>
                    <span
                      className={`pill-badge ${
                        alert.severity === 'High'
                          ? 'sev-high'
                          : alert.severity === 'Medium'
                          ? 'sev-medium'
                          : 'sev-low'
                      }`}
                    >
                      {alert.severity}
                    </span>
                  </td>
                  <td>
                    <span className="pill-badge status-resolved">{alert.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
