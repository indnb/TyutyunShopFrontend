import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import axios from "../axiosConfig";
import { validateField } from "../utils/validation";
import './Error.css';


function ChangePasswordModal({ showModal, setShowModal }) {
    const [passwordData, setPasswordData] = useState({
        old_password: "",
        new_password: "",
        confirm_password: "",
    });
    const [errors, setErrors] = useState({});
    const [serverError, setServerError] = useState("");

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        const error = validateField(name, value, { ...passwordData, [name]: value });
        setPasswordData({ ...passwordData, [name]: value });
        setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        setServerError("");

        const validationErrors = {};
        const error = validateField("password", passwordData.new_password, passwordData);
        if (error) validationErrors.new_password = error;
        const error2 = validateField("password", passwordData.confirm_password, passwordData);
        if (error) validationErrors.confirm_password = error2;

        if (!passwordData.old_password) {
            validationErrors.old_password = "Потрібно вказати старий пароль.";
        }
        if (!passwordData.confirm_password) {
            validationErrors.confirm_password = "Повторіть новий пароль.";
        }
        if (passwordData.new_password !== passwordData.confirm_password) {
            validationErrors.confirm_password = "Паролі не співпадають.";
        }
        if (passwordData.new_password === passwordData.old_password) {
            validationErrors.new_password = "Новий пароль повинен відрізнятися від старого.";
        }
        if (passwordData.confirm_password === passwordData.old_password) {
            validationErrors.confirm_password = "Новий пароль повинен відрізнятися від старого.";
        }
        if (!passwordData.new_password) {
            validationErrors.new_password = "Новий пароль не може бути порожнім.";
        }
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            await axios.post(
                "/user/update_password",
                null,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                    params: {
                        old_password: passwordData.old_password,
                        new_password: passwordData.new_password,
                    },
                }
            );

            setShowModal(false);
            setPasswordData({ old_password: "", new_password: "", confirm_password: "" });
        } catch (error) {
            if (error.response && error.response.status === 401) {
                setServerError("Старий пароль невірний.");
            } else {
                setServerError("Сталася помилка. Спробуйте ще раз.");
            }
            console.error("Error changing password:", error);
        }
    };

    const handleCancel = () => {
        setShowModal(false);
        setPasswordData({ old_password: "", new_password: "", confirm_password: "" });
        setErrors({});
        setServerError("");
    };

    return (
        <Modal show={showModal} onHide={handleCancel} centered>
            <Modal.Header>
                <Modal.Title>Змінити пароль</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {serverError && <div className="alert alert-danger">{serverError}</div>}
                <Form className="custom-error" onSubmit={handleChangePassword}>
                    {["old_password", "new_password", "confirm_password"].map((field) => (
                        <Form.Group controlId={field} key={field} className="mb-3">
                            <Form.Label>
                                {field === "old_password"
                                    ? "Старий пароль"
                                    : field === "new_password"
                                        ? "Новий пароль"
                                        : "Повторіть новий пароль"}
                            </Form.Label>
                            <Form.Control
                                type="password"
                                name={field}
                                value={passwordData[field]}
                                onChange={handleInputChange}
                                isInvalid={!!errors[field]}
                            />
                            <Form.Control.Feedback className="error-text" type="invalid">
                                {errors[field]}
                            </Form.Control.Feedback>
                        </Form.Group>
                    ))}
                </Form>
            </Modal.Body>
            <Modal.Footer className="d-flex">
                <Button variant="secondary" style={{ margin: "auto", width: "auto" }} onClick={handleCancel}>
                    Відмінити
                </Button>
                <Button variant="secondary" style={{ margin: "auto", width: "auto" }} onClick={handleChangePassword}>
                    Зберегти
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default ChangePasswordModal;
