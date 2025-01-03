import React from "react";
import tyutyun_logo from "./tyutyun-logo.png";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

function Footer() {
    return (
        <footer className="footer mt-auto py-5 bg-dark">
            <div className="d-flex flex-column bg-dark text-light py-4">
                <h5 className="text-center text-orange mb-3">Підпишись на нас :)</h5>
                <div className="d-flex justify-content-center">
                    <a href="https://www.instagram.com/tyutyun.shop.ua/" target="_blank" rel="noopener noreferrer"
                       className="text-orange">
                        <FontAwesomeIcon icon={["fab", "instagram"]} size="2x"/>
                    </a>
                </div>
            </div>
            <div className="container d-flex flex-column align-items-center text-center text-orange">
                <div className="footer-section">
                    <div className="footer-logo">
                        <img src={tyutyun_logo} alt="Tyutyun Shop Logo"/>
                    </div>
                </div>

                <div className="footer-section mt-3">
                    <div className="footer-email">
                        <span className="footer-email-prefix">Електронна пошта:</span>
                        <span className="footer-email-content"> tyutyun-shop@yacode.dev</span>
                    </div>
                </div>

                <div className="footer-section mt-3">
                    <div className="footer-workinghours">
                        <span className="footer-workinghours-prefix">Час роботи служби підтримки:</span>
                        <span className="footer-workinghours-content"> ПН-ПТ: 11:00 – 19:00</span>
                    </div>
                </div>

                <div className="footer-section mt-3">
                    <div className="footer-paymentoptions">
                        <div className="footer-paymentoptions-prefix">Приймаємо для оплати:</div>
                        <ul className="payment-list d-flex flex-column align-items-center">
                            <li>Visa</li>
                            <li>MasterCard</li>
                            <li>Приват24</li>
                            <li>Apple Pay / Google Pay</li>
                            <li>Готівка при доставці</li>
                        </ul>
                    </div>
                </div>

                <div className="footer-section mt-3">
                    <div className="footer-delivery text-center">
                        Доставка по Україні здійснюється службою доставки: Нова Пошта.
                    </div>
                </div>

                <div className="footer-section mt-3">
                    <div className="footer-copyright">© 2024, tyutyunshop.yacode.dev</div>
                </div>
            </div>
        </footer>
    );
}
export default Footer;
