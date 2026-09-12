import React, { useState, useEffect } from 'react';

export default function SlotSelector({
  slots = [],
  selectedSlotIndex = 0,
  defaultSlotIndex = 0,
  onSlotSelect,
}) {
  const [tempIndex, setTempIndex] = useState(selectedSlotIndex);

  // Synchronize when parent updates selectedSlotIndex
  useEffect(() => {
    setTempIndex(selectedSlotIndex);
  }, [selectedSlotIndex]);

  const handleDropdownChange = (e) => {
    setTempIndex(Number(e.target.value));
  };

  const handleShowDataClick = () => {
    onSlotSelect(tempIndex);
  };

  const handleCurrentSlotClick = () => {
    setTempIndex(defaultSlotIndex);
    onSlotSelect(defaultSlotIndex);
  };

  const currentSlot = slots[tempIndex] || slots[0];

  return (
    <div className="slot-selector-card">
      <div className="slot-selector-header">
        <div>
          <h2 className="slot-selector-title">Select Time Slot</h2>
          <p className="slot-selector-desc">
            Default set to current time. Choose any time window to view forecast metrics.
          </p>
        </div>

        <button
          type="button"
          className="btn-current-time"
          onClick={handleCurrentSlotClick}
          title="Jump to current hour slot"
        >
          ⏱ Jump to Current Time
        </button>
      </div>

      <div className="slot-selector-controls">
        <div className="select-wrapper">
          <label htmlFor="slot-select" className="control-label">
            Available Time Slot:
          </label>
          <select
            id="slot-select"
            className="slot-dropdown"
            value={tempIndex}
            onChange={handleDropdownChange}
          >
            {slots.map((slot) => (
              <option key={slot.id} value={slot.index}>
                {slot.isCurrent ? `★ [Current] ${slot.label}` : slot.label}
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          className="btn-show-data"
          onClick={handleShowDataClick}
        >
          Show Data
        </button>
      </div>

      {currentSlot && (
        <div className="selected-preview-pill">
          <span>Active Selection:</span>
          <strong>{currentSlot.label}</strong>
          {currentSlot.isCurrent && <span className="current-tag">Current Hour</span>}
        </div>
      )}
    </div>
  );
}
