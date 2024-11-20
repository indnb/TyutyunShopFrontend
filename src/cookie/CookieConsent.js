import React, { useState, useEffect } from "react";
import "./CookieConsent.css";

function CookieConsent() {
    const [showBanner, setShowBanner] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem("cookieConsent");
        if (!consent) {
            setShowBanner(true);
        }
    }, []);

    const acceptCookies = () => {
        localStorage.setItem("cookieConsent", "true");
        setShowBanner(false);
    };

    return (
        showBanner && (
            <div className="cookie-consent" style={{margin: "auto"}}>
                <h5 style={{margin: "auto"}}>У нас тут кукі є, прийми, щоб використовувати сайт!)</h5>
                <button onClick={acceptCookies}><h5 style={{margin: "auto"}}>Прийняти</h5></button>
            </div>
        )
    );
}

export default CookieConsent;
