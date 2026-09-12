import React, { useState } from 'react';

export default function VehicleLoginForm({ onLoginSuccess }) {
  const [regNumber, setRegNumber] = useState('');
  const [rcNumber, setRcNumber] = useState('');
  const [vehicleType, setVehicleType] = useState('4-Wheeler (Car/SUV)');
  const [rememberMe, setRememberMe] = useState(true);
  const [showRc, setShowRc] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Auto format registration number to uppercase and clean spacing
  const handleRegChange = (e) => {
    let val = e.target.value.toUpperCase().replace(/[^A-Z0-9- ]/g, '');
    setRegNumber(val);
    if (errorMessage) setErrorMessage('');
  };

  const handleRcChange = (e) => {
    let val = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    setRcNumber(val);
    if (errorMessage) setErrorMessage('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const cleanReg = regNumber.trim();
    const cleanRc = rcNumber.trim();

    if (!cleanReg) {
      setErrorMessage('Please enter the Vehicle Registration Number.');
      return;
    }

    if (cleanReg.length < 6) {
      setErrorMessage('Please enter a valid Registration Number (e.g. GJ-01-EV-4092).');
      return;
    }

    if (!cleanRc) {
      setErrorMessage('Please enter the RC Book Number of the vehicle.');
      return;
    }

    if (cleanRc.length < 6) {
      setErrorMessage('RC Book Number must be at least 6 alphanumeric characters.');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    // Simulate verification with Vahan & GreenCharge Network Registry
    setTimeout(() => {
      setIsLoading(false);
      const vehicleData = {
        registrationNumber: cleanReg,
        rcBookNumber: cleanRc,
        vehicleType,
        rememberMe,
        loginTime: new Date().toISOString(),
      };

      if (onLoginSuccess) {
        onLoginSuccess(vehicleData);
      }
    }, 900);
  };

  return (
    <form className="vehicle-login-form" onSubmit={handleSubmit} noValidate>
      {/* License Plate Live Preview */}
      <div className="plate-preview-wrapper" aria-label="Vehicle Plate Preview">
        <div className="plate-preview-badge">
          <div className="plate-ind-strip">
            <span className="plate-ind-text">IND</span>
            <span className="plate-chakra-dot">☸</span>
          </div>
          <span className="plate-number-text">
            {regNumber.trim() ? regNumber.trim() : 'GJ •• EV ••••'}
          </span>
          <div className="plate-ev-tag">
            <span>⚡ EV</span>
          </div>
        </div>
      </div>

      {/* Error Notice */}
      {errorMessage && (
        <div className="login-error-banner" role="alert">
          <svg viewBox="0 0 20 20" width="16" height="16" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Field 1: Registration Number */}
      <div className="login-form-group">
        <div className="label-row">
          <label htmlFor="vehicle-reg-input" className="form-field-label">
            Registration Number of Vehicle <span className="req-star">*</span>
          </label>
          <span className="field-hint">e.g. GJ-01-EV-4092</span>
        </div>
        <div className="input-icon-wrapper">
          <span className="input-prefix-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 11l2-5h10l2 5" strokeLinecap="round" strokeLinejoin="round" />
              <rect x="3" y="11" width="18" height="6" rx="2" />
              <circle cx="7.5" cy="17.5" r="1.5" fill="currentColor" />
              <circle cx="16.5" cy="17.5" r="1.5" fill="currentColor" />
            </svg>
          </span>
          <input
            id="vehicle-reg-input"
            type="text"
            className="login-text-input uppercase-input"
            placeholder="Enter vehicle reg (e.g. GJ-01-EV-4092)"
            value={regNumber}
            onChange={handleRegChange}
            maxLength={16}
            autoComplete="off"
            required
            disabled={isLoading}
          />
        </div>
      </div>

      {/* Field 2: RC Book Number */}
      <div className="login-form-group">
        <div className="label-row">
          <label htmlFor="vehicle-rc-input" className="form-field-label">
            RC Book Number of Vehicle <span className="req-star">*</span>
          </label>
          <span className="field-hint">Vahan Registration Certificate</span>
        </div>
        <div className="input-icon-wrapper">
          <span className="input-prefix-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" strokeLinecap="round" strokeLinejoin="round" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
          </span>
          <input
            id="vehicle-rc-input"
            type={showRc ? 'text' : 'password'}
            className="login-text-input uppercase-input"
            placeholder="Enter RC book number (e.g. RC2024GJ992144)"
            value={rcNumber}
            onChange={handleRcChange}
            maxLength={20}
            autoComplete="off"
            required
            disabled={isLoading}
          />
          <button
            type="button"
            className="input-suffix-btn"
            onClick={() => setShowRc(!showRc)}
            title={showRc ? 'Hide RC Number' : 'Show RC Number'}
            tabIndex="-1"
          >
            {showRc ? (
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" strokeLinecap="round" strokeLinejoin="round" />
                <line x1="1" y1="1" x2="23" y2="23" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Field 3: Vehicle Category */}
      <div className="login-form-group">
        <label htmlFor="vehicle-type-select" className="form-field-label">
          Vehicle Category / Class
        </label>
        <div className="input-icon-wrapper">
          <span className="input-prefix-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <polygon points="12 8 8 12 12 16 16 12 12 8" />
            </svg>
          </span>
          <select
            id="vehicle-type-select"
            className="login-select-input"
            value={vehicleType}
            onChange={(e) => setVehicleType(e.target.value)}
            disabled={isLoading}
          >
            <option value="4-Wheeler (Car/SUV)">4-Wheeler (Car / Electric SUV)</option>
            <option value="Commercial Fleet Van">Commercial Fleet Van / Logistics</option>
            <option value="2-Wheeler (Scooter)">2-Wheeler (Scooter / Motorcycle)</option>
            <option value="Auto Rickshaw (3W)">3-Wheeler (Electric Auto / L5M)</option>
            <option value="Heavy EV Bus/Truck">Heavy Commercial Bus / Truck</option>
          </select>
        </div>
      </div>

      {/* Remember Me & Help */}
      <div className="login-extras-row">
        <label className="remember-checkbox-label">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            disabled={isLoading}
          />
          <span>Remember this EV session</span>
        </label>
        <span className="security-note">
          <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor">
            <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" />
          </svg>
          Vahan Node Verified
        </span>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="btn-login-submit"
        disabled={isLoading}
      >
        {isLoading ? (
          <span className="btn-loading-content">
            <span className="spinner-dot" />
            Verifying Vehicle Registry...
          </span>
        ) : (
          <span className="btn-content">
            <span>Log In with Vehicle</span>
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </span>
        )}
      </button>
    </form>
  );
}
