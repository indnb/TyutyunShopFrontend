import Banner from "./Banner";
import ScrollToTopOnMount from "../template/ScrollToTopOnMount";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function Landing() {
    return (
        <>
            <ScrollToTopOnMount />
            <Banner />
            <div className="d-flex flex-column bg-dark text-light py-4">
                <h5 className="text-center text-orange mb-3">Follow us on</h5>
                <div className="d-flex justify-content-center">
                    <a href="https://www.instagram.com/tyutyun.shop.ua/" target="_blank" rel="noopener noreferrer"
                       className="text-orange">
                        <FontAwesomeIcon icon={["fab", "instagram"]} size="2x" />
                    </a>
                </div>
            </div>
        </>
    );
}

export default Landing;
