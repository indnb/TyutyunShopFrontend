import {Button, Modal, Table} from "react-bootstrap";
import React from "react";

function OrderDetailsModal({ orderDetails, showModal, setShowModal }) {
    return (
        <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
            <Modal.Header>
                <Modal.Title>Деталі замовлення</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {orderDetails ? (
                    <>
                        <h5>Інформація про доставку</h5>
                        <p><strong>Адреса:</strong> {orderDetails.shipping.address}</p>
                        <p><strong>Ім'я:</strong> {orderDetails.shipping.first_name} {orderDetails.shipping.last_name}</p>
                        <p><strong>Телефон:</strong> {orderDetails.shipping.phone_number}</p>
                        <p><strong>Email:</strong> {orderDetails.shipping.email}</p>
                        <hr />
                        <h5>Товари</h5>
                        <Table striped bordered hover>
                            <thead>
                            <tr>
                                <th>Назва</th>
                                <th>Кількість</th>
                                <th>Розмір</th>
                                <th>Ціна</th>
                            </tr>
                            </thead>
                            <tbody >
                            {orderDetails.items.map((item) => (
                                <tr key={item.id}>
                                    <td>{item.product_name}</td>
                                    <td>{item.quantity}</td>
                                    <td>{item.size || 'N/A'}</td>
                                    <td>{item.total_price} грн</td>
                                </tr>
                            ))}
                            </tbody>
                        </Table>
                    </>
                ) : (
                    <p>Завантаження...</p>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => setShowModal(false)}>Закрити</Button>
            </Modal.Footer>
        </Modal>
    );
}
export default OrderDetailsModal;