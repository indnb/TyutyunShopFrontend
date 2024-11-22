import React, { useState } from "react";
import "./CustomAlert.css";

export function useCustomAlert() {
    const [alert, setAlert] = useState({ visible: false, message: "" });

    const showAlert = (message) => {
        setAlert({ visible: true, message });
    };

    const hideAlert = () => {
        setAlert({ visible: false, message: "" });
    };

    return { alert, showAlert, hideAlert };
}

function CustomAlert({ alert, onClose }) {
    if (!alert.visible) return null;

    return (
        <div className="custom-alert-overlay">
            <div className="custom-alert-box">
                <p>{alert.message}</p>
                <button onClick={onClose}>OK</button>
            </div>
        </div>
    );
}

export default CustomAlert;
