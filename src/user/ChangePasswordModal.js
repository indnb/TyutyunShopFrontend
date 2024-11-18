import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import axios from "../axiosConfig";
import {validateField} from "../utils/validation";

function ChangePasswordModal({ showModal, setShowModal }) {
    const [passwordData, setPasswordData] = useState({
        old_password: "",
        new_password: "",
        confirm_password: "",
    });
    const [errors, setErrors] = useState({});

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        const error = validateField(name, value, passwordData);
        setPasswordData({ ...passwordData, [name]: value });
        setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        const validationErrors = {};
        Object.keys(passwordData).forEach((field) => {
            const error = validateField(field, passwordData[field], passwordData);
            if (error) validationErrors[field] = error;
        });

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            await axios.post("/user/change-password", passwordData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            setShowModal(false);
        } catch (error) {
            console.error("Error changing password:", error);
        }
    };
    const handleCancel = () => {
        setShowModal(false);
        setPasswordData({ old_password: "", new_password: "", confirm_password: "" });
    };

    return (
        <Modal show={showModal} onHide={handleCancel} centered>
            <Modal.Header>
                <Modal.Title>Змінити пароль</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    {["old_password", "new_password", "confirm_password"].map((field) => (
                        <Form.Group controlId={field} key={field} className="mb-3">
                            <Form.Label>{field === "old_password" ? "Старий пароль" : field === "new_password" ? "Новий пароль" : "Повторіть новий пароль"}</Form.Label>
                            <Form.Control
                                type="password"
                                name={field}
                                value={passwordData[field]}
                                onChange={handleInputChange}
                                isInvalid={!!errors[field]}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors[field]}
                            </Form.Control.Feedback>
                        </Form.Group>
                    ))}
                </Form>
            </Modal.Body>
            <Modal.Footer className={"d-flex"}>
                <Button variant="secondary" style={{margin: "auto", width: "auto"}} onClick={handleCancel}>
                    Відмінити
                </Button>
                <Button variant="secondary" style={{margin: "auto", width: "auto"}} onClick={handleChangePassword}>
                    Зберегти
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default ChangePasswordModal;
