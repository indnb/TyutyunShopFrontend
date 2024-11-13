import React, { useState } from 'react';
import './ToggleSwitch.css';

function ToggleSwitch({ label, onChange }) {
    const [isChecked, setIsChecked] = useState(false);

    const handleToggle = () => {
        setIsChecked(!isChecked);
        onChange(!isChecked);
    };

    return (
        <div className="toggle-container" onClick={handleToggle}>
            <div className={`toggle-switch ${isChecked ? 'checked' : ''}`}></div>
            {label && <span className="toggle-label">{label}</span>}
        </div>
    );
}

export default ToggleSwitch;
