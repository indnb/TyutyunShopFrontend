// Template.js
import Header from "./Header";
import Content from "./Content";
import Footer from "./Footer";
import './Template.css';

function Template(props) {
    return (
        <div className="template-container">
            <Header />
            <Content>{props.children}</Content>
            <Footer />
        </div>
    );
}

export default Template;
