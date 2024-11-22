import React, { createContext } from "react";
import Header from "./Header";
import Content from "./Content";
import Footer from "./Footer";
import './Template.css';
import CookieConsent from "../cookie/CookieConsent";
import CustomAlert, { useCustomAlert } from "./CustomAlert";

export const AlertContext = createContext();

function Template({ children }) {
    const { alert, showAlert, hideAlert } = useCustomAlert();

    return (
        <AlertContext.Provider value={{ showAlert, hideAlert }}>
            <div className="template-container">
                <CookieConsent />
                <CustomAlert alert={alert} onClose={hideAlert} />
                <Header className="header" />
                <Content>{children}</Content>
                <Footer />
            </div>
        </AlertContext.Provider>
    );
}

export default Template;
