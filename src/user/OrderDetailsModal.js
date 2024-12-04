import { Button, Modal, Table, Spinner } from "react-bootstrap";
import React from "react";

function OrderDetailsModal({ orderDetails, showModal, setShowModal }) {
    return (
        <Modal
            show={showModal}
            onHide={() => setShowModal(false)}
            size="lg"
            fullscreen="sm-down"
            aria-labelledby="order-details-title"
            aria-describedby="order-details-description"
        >
            <Modal.Header>
                <Modal.Title id="order-details-title">Деталі замовлення</Modal.Title>
            </Modal.Header>
            <Modal.Body id="order-details-description">
                {orderDetails ? (
                    <>
                        <h5>Інформація про доставку</h5>
                        <p><strong>Адреса:</strong> {orderDetails?.shipping?.city + ", " + orderDetails?.shipping?.branch}</p>
                        <p><strong>Ім'я:</strong> {orderDetails?.shipping?.first_name || ''} {orderDetails?.shipping?.last_name || ''}</p>
                        <p><strong>Телефон:</strong> {orderDetails?.shipping?.phone_number || 'N/A'}</p>
                        <p><strong>Пошта:</strong> {orderDetails?.shipping?.email || 'N/A'}</p>
                        <hr />
                        <h5>Товари</h5>
                        <div className="table-responsive">
                            <Table striped bordered hover>
                                <thead>
                                <tr>
                                    <th>Назва</th>
                                    <th>Кількість</th>
                                    <th>Розмір</th>
                                    <th>Ціна</th>
                                </tr>
                                </thead>
                                <tbody>
                                {orderDetails?.items?.length ? (
                                    orderDetails.items.map((item) => (
                                        <tr key={item.id}>
                                            <td>{item.product_name || 'N/A'}</td>
                                            <td>{item.quantity || 0}</td>
                                            <td>{item.size || 'N/A'}</td>
                                            <td>{item.total_price || 0} грн</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="text-center">Товари відсутні</td>
                                    </tr>
                                )}
                                </tbody>
                            </Table>
                        </div>
                    </>
                ) : (
                    <div className="text-center">
                        <Spinner animation="border" role="status">
                            <span className="visually-hidden">Завантаження...</span>
                        </Spinner>
                        <p>Завантаження...</p>
                    </div>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => setShowModal(false)}>Закрити</Button>
            </Modal.Footer>
        </Modal>
    );
}

export default OrderDetailsModal;
