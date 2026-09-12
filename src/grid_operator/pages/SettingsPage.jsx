import React, { useState } from 'react';

export default function SettingsPage() {
  const [autoBalance, setAutoBalance] = useState(true);
  const [maxDemandCurtailment, setMaxDemandCurtailment] = useState(25);
  const [renewableReserveMargin, setRenewableReserveMargin] = useState(15);
  const [highAlertThreshold, setHighAlertThreshold] = useState(85);

  return (
    <div className="grid-page-content settings-page">
      <div className="grid-card">
        <div className="card-header-clean">
          <div>
            <h3 className="card-title">Grid Automation & Threshold Settings</h3>
            <p className="card-subtitle">Configure automated EV smart dispatch and grid stability triggers.</p>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '12px 0' }}>
          {/* Setting 1: Auto Balance */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #F1F5F9', paddingBottom: '14px' }}>
            <div>
              <div style={{ fontSize: '13.5px', fontWeight: 600, color: '#0F172A' }}>Automated EV Load Balancing</div>
              <div style={{ fontSize: '11.5px', color: '#64748B', marginTop: '2px' }}>Dynamically shift EV charging sessions away from peak stress periods.</div>
            </div>
            <label style={{ position: 'relative', display: 'inline-block', width: '44px', height: '24px' }}>
              <input
                type="checkbox"
                checked={autoBalance}
                onChange={(e) => setAutoBalance(e.target.checked)}
                style={{ opacity: 0, width: 0, height: 0 }}
              />
              <span
                style={{
                  position: 'absolute',
                  cursor: 'pointer',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: autoBalance ? '#10B981' : '#CBD5E1',
                  transition: '0.2s',
                  borderRadius: '24px',
                }}
              >
                <span
                  style={{
                    position: 'absolute',
                    content: '""',
                    height: '18px',
                    width: '18px',
                    left: '3px',
                    bottom: '3px',
                    backgroundColor: 'white',
                    transition: '0.2s',
                    borderRadius: '50%',
                    transform: autoBalance ? 'translateX(20px)' : 'none',
                  }}
                />
              </span>
            </label>
          </div>

          {/* Setting 2: Regional Alert Threshold */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #F1F5F9', paddingBottom: '14px' }}>
            <div>
              <div style={{ fontSize: '13.5px', fontWeight: 600, color: '#0F172A' }}>High Stress Alert Threshold</div>
              <div style={{ fontSize: '11.5px', color: '#64748B', marginTop: '2px' }}>Trigger high severity notifications when regional load exceeds capacity.</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input
                type="number"
                value={highAlertThreshold}
                onChange={(e) => setHighAlertThreshold(Number(e.target.value))}
                style={{ width: '65px', padding: '6px 8px', border: '1px solid #E2E8F0', borderRadius: '6px', fontSize: '13px', fontWeight: 600 }}
              />
              <span style={{ fontSize: '12px', color: '#64748B', fontWeight: 600 }}>%</span>
            </div>
          </div>

          {/* Setting 3: Max Demand Curtailment */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #F1F5F9', paddingBottom: '14px' }}>
            <div>
              <div style={{ fontSize: '13.5px', fontWeight: 600, color: '#0F172A' }}>Max Demand Curtailment Limit</div>
              <div style={{ fontSize: '11.5px', color: '#64748B', marginTop: '2px' }}>Maximum allowable throttling of high-demand DC fast charging hubs during emergency.</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input
                type="number"
                value={maxDemandCurtailment}
                onChange={(e) => setMaxDemandCurtailment(Number(e.target.value))}
                style={{ width: '65px', padding: '6px 8px', border: '1px solid #E2E8F0', borderRadius: '6px', fontSize: '13px', fontWeight: 600 }}
              />
              <span style={{ fontSize: '12px', color: '#64748B', fontWeight: 600 }}>%</span>
            </div>
          </div>

          {/* Setting 4: Renewable Reserve Margin */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '13.5px', fontWeight: 600, color: '#0F172A' }}>Renewable Reserve Margin</div>
              <div style={{ fontSize: '11.5px', color: '#64748B', marginTop: '2px' }}>Safety buffer percentage reserved for cloud cover or sudden wind drop.</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input
                type="number"
                value={renewableReserveMargin}
                onChange={(e) => setRenewableReserveMargin(Number(e.target.value))}
                style={{ width: '65px', padding: '6px 8px', border: '1px solid #E2E8F0', borderRadius: '6px', fontSize: '13px', fontWeight: 600 }}
              />
              <span style={{ fontSize: '12px', color: '#64748B', fontWeight: 600 }}>%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
