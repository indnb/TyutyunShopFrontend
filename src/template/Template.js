// Template.js
import Header from "./Header";
import Content from "./Content";
import Footer from "./Footer";
import './Template.css';
import CookieConsent from "../cookie/CookieConsent";
import React from "react";

function Template(props) {
    return (
        <div className="template-container">
            <CookieConsent />
            <Header className="header" />
            <Content>{props.children}</Content>
            <Footer />
        </div>
    );
}

export default Template;
