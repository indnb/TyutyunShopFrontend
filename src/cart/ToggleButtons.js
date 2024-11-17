import React, { useState } from 'react';
import './ToggleSwitch.css';

function ToggleButtons({ label1, label2, onChange }) {
    const [selected, setSelected] = useState(label1);

    const handleClick = (label) => {
        setSelected(label);
        onChange(label);
    };

    return (
        <div className="toggle-buttons-container">
            <button
                type="reset"
                className={`toggle-button ${selected === label1 ? 'active' : ''}`}
                onClick={() => handleClick(label1)}
            >
                {label1}
            </button>
            <button
                type="reset"
                className={`toggle-button ${selected === label2 ? 'active' : ''}`}
                onClick={() => handleClick(label2)}
            >
                {label2}
            </button>
        </div>
    );
}

export default ToggleButtons;
