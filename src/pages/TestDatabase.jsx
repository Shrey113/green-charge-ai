import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  fetchDatabaseStatus,
  fetchDatabaseCollections,
  fetchCollectionData,
  insertTestRecord,
  reconnectDatabase,
} from '../services/databaseService.js';

export default function TestDatabase() {
  const [status, setStatus] = useState(null);
  const [collections, setCollections] = useState([]);
  const [activeCollection, setActiveCollection] = useState('car_customer');
  const [documents, setDocuments] = useState([]);
  const [totalDocs, setTotalDocs] = useState(0);

  const [loading, setLoading] = useState(true);
  const [loadingDocs, setLoadingDocs] = useState(false);
  const [reconnecting, setReconnecting] = useState(false);
  const [inserting, setInserting] = useState(false);
  const [errorNotice, setErrorNotice] = useState(null);
  const [actionSuccess, setActionSuccess] = useState(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [expandedDocs, setExpandedDocs] = useState({});

  // Fetch complete database state
  const loadState = useCallback(async () => {
    setLoading(true);
    setErrorNotice(null);
    try {
      // 1. Fetch connection status
      const statusRes = await fetchDatabaseStatus();
      setStatus(statusRes);

      // 2. Fetch collections
      const colRes = await fetchDatabaseCollections();
      const colList = colRes.collections || [];
      setCollections(colList);

      // Choose active collection (prefer car_customer if present)
      let targetCol = activeCollection;
      if (colList.length > 0) {
        const hasCurrent = colList.some((c) => c.name === targetCol);
        if (!hasCurrent) {
          const hasCarCustomer = colList.find((c) => c.name === 'car_customer');
          targetCol = hasCarCustomer ? 'car_customer' : colList[0].name;
          setActiveCollection(targetCol);
        }
      }

      // 3. Fetch documents from active collection
      if (targetCol) {
        setLoadingDocs(true);
        const dataRes = await fetchCollectionData(targetCol, 1, 30);
        setDocuments(dataRes.documents || []);
        setTotalDocs(dataRes.total || 0);
      }
    } catch (err) {
      console.error('Failed to load database state:', err);
      setErrorNotice(err.message || 'Could not connect to backend server on port 5000.');
    } finally {
      setLoading(false);
      setLoadingDocs(false);
    }
  }, [activeCollection]);

  // Load collection documents specifically
  const loadCollectionDocs = useCallback(async (colName) => {
    setLoadingDocs(true);
    try {
      const dataRes = await fetchCollectionData(colName, 1, 30);
      setDocuments(dataRes.documents || []);
      setTotalDocs(dataRes.total || 0);
    } catch (err) {
      console.error(`Failed to load documents for ${colName}:`, err);
    } finally {
      setLoadingDocs(false);
    }
  }, []);

  useEffect(() => {
    loadState();
  }, [loadState]);

  const handleSelectCollection = (name) => {
    setActiveCollection(name);
    loadCollectionDocs(name);
  };

  const handleReconnect = async () => {
    setReconnecting(true);
    setActionSuccess(null);
    setErrorNotice(null);
    try {
      const res = await reconnectDatabase();
      if (res.status?.connected) {
        setActionSuccess('Connected successfully to MongoDB Atlas!');
      } else if (res.status?.lastError) {
        setErrorNotice(res.status.lastError);
      } else {
        setActionSuccess(res.message);
      }
      await loadState();
    } catch (err) {
      setErrorNotice(`Reconnect failed: ${err.message}`);
    } finally {
      setReconnecting(false);
    }
  };

  const handleInsertSample = async () => {
    setInserting(true);
    setActionSuccess(null);
    setErrorNotice(null);
    try {
      const res = await insertTestRecord(activeCollection || 'data');
      setActionSuccess(`Inserted test EV document (${res.insertedId || 'OK'}) into '${activeCollection || 'data'}'!`);
      // Reload documents and collections
      await loadCollectionDocs(activeCollection || 'data');
      const colRes = await fetchDatabaseCollections();
      setCollections(colRes.collections || []);
    } catch (err) {
      setErrorNotice(`Insert failed: ${err.message}`);
    } finally {
      setInserting(false);
    }
  };

  const toggleJson = (id) => {
    setExpandedDocs((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Filter documents by search query
  const filteredDocuments = useMemo(() => {
    if (!searchQuery.trim()) return documents;
    const q = searchQuery.toLowerCase();
    return documents.filter((doc) => {
      const jsonStr = JSON.stringify(doc).toLowerCase();
      return jsonStr.includes(q);
    });
  }, [documents, searchQuery]);

  const isConnected = status?.connected === true;
  const isBadAuth = status?.lastError?.toLowerCase().includes('bad auth') || status?.hasPlaceholderPassword;

  return (
    <div className="test-db-page">
      {/* Top Banner */}
      <div className="test-db-banner">
        <div className="test-db-banner-left">
          <div className="test-db-icon-box">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
              <ellipse cx="12" cy="5" rx="9" ry="3" />
              <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
              <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
            </svg>
          </div>
          <div>
            <h2 className="test-db-title">MongoDB Database & Live Collections Explorer</h2>
            <div className="test-db-subtitle">
              <span>URI:</span>
              <code className="test-db-uri-code">
                {status?.maskedUri || 'mongodb+srv://pushparajsinhwork_db_user:••••••••@cluster0.5uottmj.mongodb.net/...'}
              </code>
              {status?.databaseName && <span>&bull; Database: <strong>{status.databaseName}</strong></span>}
            </div>
          </div>
        </div>

        <div className="test-db-banner-actions">
          <button
            type="button"
            className="btn-db-action secondary"
            onClick={loadState}
            disabled={loading || reconnecting}
          >
            {loading ? 'Refreshing...' : '↻ Refresh'}
          </button>
          <button
            type="button"
            className="btn-db-action secondary"
            onClick={handleReconnect}
            disabled={reconnecting}
          >
            {reconnecting ? 'Reconnecting...' : '⚡ Test Connection'}
          </button>
          <button
            type="button"
            className="btn-db-action primary"
            onClick={handleInsertSample}
            disabled={inserting}
          >
            {inserting ? 'Inserting...' : '➕ Add Test EV Record'}
          </button>
        </div>
      </div>

      {/* Success Notification */}
      {actionSuccess && (
        <div className="test-db-alert" style={{ background: '#ecfdf5', borderColor: '#a7f3d0' }}>
          <div className="alert-icon" style={{ color: '#059669' }}>✅</div>
          <div className="alert-body">
            <h4 style={{ color: '#065f46' }}>Operation Succeeded</h4>
            <p style={{ color: '#047857', margin: 0 }}>{actionSuccess}</p>
          </div>
        </div>
      )}

      {/* Auth Guidance Notice / Alert */}
      {isBadAuth && (
        <div className="test-db-alert error">
          <div className="alert-icon">⚠️</div>
          <div className="alert-body">
            <h4>MongoDB Atlas Authentication Notice</h4>
            <p>
              The connection string in <strong>server/.env</strong> is currently configured with the username{' '}
              <code>pushparajsinhwork_db_user</code> and placeholder password <code>YOUR_NEW_PASSWORD</code>.
            </p>
            <div className="alert-code-step">
              Edit <strong>server/.env</strong> &rarr; Replace <code>YOUR_NEW_PASSWORD</code> with your real MongoDB Atlas database password &rarr; Click <strong>"⚡ Test Connection"</strong> above.
            </div>
          </div>
        </div>
      )}

      {/* General / Connection Error Notice */}
      {!isConnected && (errorNotice || status?.lastError) && !isBadAuth && (
        <div className="test-db-alert error">
          <div className="alert-icon">❌</div>
          <div className="alert-body">
            <h4>Connection Notice</h4>
            <p>{errorNotice || status?.lastError}</p>
          </div>
        </div>
      )}

      {/* Stats Summary Grid */}
      <div className="test-db-stats-grid">
        <div className="test-db-stat-card">
          <div className={`stat-card-icon ${isConnected ? 'emerald' : 'amber'}`}>
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 14 14" />
            </svg>
          </div>
          <div>
            <p className="stat-card-label">Cluster Status</p>
            <div className="stat-card-val">
              <span className={`status-pill ${isConnected ? 'connected' : isBadAuth ? 'connecting' : 'disconnected'}`}>
                <span className="status-dot"></span>
                {isConnected ? 'Connected' : isBadAuth ? 'Auth Required' : 'Disconnected'}
              </span>
            </div>
          </div>
        </div>

        <div className="test-db-stat-card">
          <div className="stat-card-icon blue">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="2" width="20" height="8" rx="2" ry="2" />
              <rect x="2" y="14" width="20" height="8" rx="2" ry="2" />
              <line x1="6" y1="6" x2="6.01" y2="6" />
              <line x1="6" y1="18" x2="6.01" y2="18" />
            </svg>
          </div>
          <div>
            <p className="stat-card-label">Active Database</p>
            <h3 className="stat-card-val">{status?.databaseName || 'cluster0'}</h3>
          </div>
        </div>

        <div className="test-db-stat-card">
          <div className="stat-card-icon purple">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
            </svg>
          </div>
          <div>
            <p className="stat-card-label">Collections</p>
            <h3 className="stat-card-val">{collections.length} Collections</h3>
          </div>
        </div>

        <div className="test-db-stat-card">
          <div className="stat-card-icon emerald">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
          </div>
          <div>
            <p className="stat-card-label">Target Documents</p>
            <h3 className="stat-card-val">{totalDocs} Records</h3>
          </div>
        </div>
      </div>

      {/* Main Database Content Area */}
      <div className="test-db-content-card">
        {/* Collections Tab Bar */}
        <div className="collection-tabs-header">
          <div className="collection-tabs-list">
            <span style={{ fontSize: '13px', fontWeight: '700', color: '#64748b', marginRight: '6px' }}>
              COLLECTIONS:
            </span>

            {/* If no collections list returned from server, show default 'data' tab */}
            {collections.length === 0 ? (
              <button
                type="button"
                className={`collection-tab-btn ${activeCollection === 'data' ? 'active' : ''}`}
                onClick={() => handleSelectCollection('data')}
              >
                📄 data
                <span className="collection-badge-count">{totalDocs}</span>
              </button>
            ) : (
              collections.map((col) => {
                const isActive = activeCollection === col.name;
                return (
                  <button
                    key={col.name}
                    type="button"
                    className={`collection-tab-btn ${isActive ? 'active' : ''}`}
                    onClick={() => handleSelectCollection(col.name)}
                  >
                    📄 {col.name}
                    <span className="collection-badge-count">{col.count}</span>
                  </button>
                );
              })
            )}
          </div>

          <button
            type="button"
            className="btn-db-action primary"
            style={{ padding: '6px 12px', fontSize: '12.5px' }}
            onClick={handleInsertSample}
            disabled={inserting}
          >
            ➕ Insert Record to '{activeCollection}'
          </button>
        </div>

        {/* Search and Toolbar */}
        <div className="data-toolbar">
          <div className="data-search-box">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#94a3b8" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder={`Search records in ${activeCollection}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="data-toolbar-actions">
            <span style={{ fontSize: '12.5px', color: '#64748b' }}>
              Showing <strong>{filteredDocuments.length}</strong> of <strong>{totalDocs}</strong> records
            </span>
          </div>
        </div>

        {/* Loading Documents Spinner */}
        {loadingDocs && (
          <div className="loading-container" style={{ padding: '32px 0' }}>
            <div className="spinner"></div>
            <p>Querying collection '{activeCollection}' from MongoDB Atlas...</p>
          </div>
        )}

        {/* Empty Collection State */}
        {!loadingDocs && filteredDocuments.length === 0 && (
          <div className="empty-db-state">
            <div className="empty-db-icon">
              <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
            </div>
            <h3 className="empty-db-title">No Documents in Collection '{activeCollection}'</h3>
            <p className="empty-db-desc">
              This collection currently contains 0 records. You can insert a live test EV charging session document to verify real-time database operations.
            </p>
            <button
              type="button"
              className="btn-db-action primary"
              onClick={handleInsertSample}
              disabled={inserting}
            >
              ➕ Insert Test EV Charging Record
            </button>
          </div>
        )}

        {/* Documents Stream View */}
        {!loadingDocs && filteredDocuments.length > 0 && (
          <div className="documents-stream">
            {filteredDocuments.map((doc, idx) => {
              const docId = doc._id ? String(doc._id) : `doc-${idx}`;
              const isExpanded = !!expandedDocs[docId];

              // Extract preview fields from car_customer or generic document schema
              const customerName = doc.name || doc.customer_name || null;
              const customerId = doc.customerId || doc.customer_id || null;
              const titleText = customerName
                ? `${customerId ? `[${customerId}] ` : ''}${customerName}`
                : doc.vehicle_model || doc.session_id || `Record #${idx + 1}`;

              const vehicleName = doc.vehicle
                ? `${doc.vehicle.make || ''} ${doc.vehicle.model || ''} (${doc.vehicle.plateNumber || doc.vehicle.year || 'EV'})`.trim()
                : doc.vehicle_model || 'N/A';

              const station = doc.chargingStatus?.stationId || doc.station_name || doc.station || 'Gandhinagar Hub';
              const slot = doc.chargingStatus?.allocatedSlot || doc.chargingRequest?.arrivalSlot || null;

              const currentSoc = doc.vehicle?.currentSocPercent ?? doc.current_soc_percent;
              const targetSoc = doc.chargingRequest?.targetSocPercent ?? doc.target_soc_percent;

              const energyReq = doc.chargingRequest?.requiredEnergyKwh ?? doc.energy_delivered_kwh ?? null;
              const greenPct = doc.chargingStatus?.greenEnergyPercentage ?? (doc.green_energy_fraction ? Math.round(doc.green_energy_fraction * 100) : null);
              const statusVal = doc.chargingStatus?.status || doc.status || 'active';
              const costVal = doc.chargingStatus?.estimatedCostInr;
              const contactInfo = doc.contact?.phone || doc.contact?.email;
              const dateStr = doc.chargingStatus?.lastUpdated || doc.recorded_at || doc.createdAt || null;

              return (
                <div key={docId} className="document-card">
                  <div className="document-card-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span className="doc-id-pill">{customerId || `_id: ${docId.slice(-6)}`}</span>
                      <span style={{ fontWeight: '700', color: '#0f172a', fontSize: '13.5px' }}>{titleText}</span>
                      {doc.vehicle && (
                        <span style={{ fontSize: '12px', color: '#0284c7', background: '#e0f2fe', padding: '1px 8px', borderRadius: '4px' }}>
                          {vehicleName}
                        </span>
                      )}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      {dateStr && (
                        <span className="doc-meta-date">
                          {new Date(dateStr).toLocaleString()}
                        </span>
                      )}
                      <button
                        type="button"
                        className="btn-db-action secondary"
                        style={{ padding: '3px 9px', fontSize: '11.5px' }}
                        onClick={() => toggleJson(docId)}
                      >
                        {isExpanded ? '▲ Hide JSON' : '▼ Raw JSON'}
                      </button>
                    </div>
                  </div>

                  <div className="document-card-body">
                    {/* Visual Key-Value Grid */}
                    <div className="doc-fields-grid">
                      <div className="doc-field-item">
                        <span className="doc-field-key">Station & Slot</span>
                        <span className="doc-field-val">
                          {station} {slot ? `• ${slot}` : ''}
                        </span>
                      </div>

                      {currentSoc !== undefined && (
                        <div className="doc-field-item">
                          <span className="doc-field-key">Battery SoC</span>
                          <span className="doc-field-val">
                            {currentSoc}% &rarr; {targetSoc || 85}%
                          </span>
                        </div>
                      )}

                      {energyReq !== null && (
                        <div className="doc-field-item">
                          <span className="doc-field-key">Energy</span>
                          <span className="doc-field-val" style={{ color: '#059669' }}>
                            {energyReq} kWh {costVal ? `(₹${costVal})` : ''}
                          </span>
                        </div>
                      )}

                      {greenPct !== null && (
                        <div className="doc-field-item">
                          <span className="doc-field-key">Green Energy</span>
                          <span className="doc-field-val" style={{ color: '#0284c7' }}>
                            {greenPct}% Clean
                          </span>
                        </div>
                      )}

                      <div className="doc-field-item">
                        <span className="doc-field-key">Status</span>
                        <span className="doc-field-val" style={{ textTransform: 'capitalize' }}>
                          <span
                            style={{
                              display: 'inline-block',
                              width: '8px',
                              height: '8px',
                              borderRadius: '50%',
                              marginRight: '6px',
                              background: statusVal === 'completed' || statusVal === 'scheduled' ? '#10b981' : '#f59e0b',
                            }}
                          ></span>
                          {statusVal}
                        </span>
                      </div>

                      {contactInfo && (
                        <div className="doc-field-item">
                          <span className="doc-field-key">Contact</span>
                          <span className="doc-field-val" style={{ fontSize: '12.5px', color: '#475569' }}>
                            {contactInfo}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Expandable Raw JSON Document Box */}
                    {isExpanded && (
                      <div className="doc-raw-json-box">
                        <pre style={{ margin: 0 }}>{JSON.stringify(doc, null, 2)}</pre>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
