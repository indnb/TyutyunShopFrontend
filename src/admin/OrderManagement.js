import React, { useState, useEffect } from 'react';
import axios from '../axiosConfig';
import { Table, Button, Form, Modal } from 'react-bootstrap';

function OrderManagement() {
    const [orders, setOrders] = useState([]);
    const [statusFilter, setStatusFilter] = useState(null);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [orderDetails, setOrderDetails] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        fetchOrders();
    }, [statusFilter]);

    const fetchOrders = () => {
        axios.get('/orders', { params: { status: statusFilter } })
            .then((response) => setOrders(response.data))
            .catch((error) => console.error('Error fetching orders:', error));
    };

    const fetchOrderDetails = (orderId) => {
        axios.get(`/orders/${orderId}/details`)
            .then((response) => {
                setOrderDetails(response.data);
                setShowModal(true);
            })
            .catch((error) => console.error('Error fetching order details:', error));
    };

    const handleStatusChange = (orderId, newStatus) => {
        axios.put(`/orders/${orderId}`, { status: newStatus })
            .then(() => fetchOrders())
            .catch((error) => console.error('Error updating order status:', error));
    };

    const handleDelete = (orderId) => {
        if (window.confirm('Ви впевнені що хочете видалити це замовлення?')) {
            axios.delete(`/orders/${orderId}`)
                .then(() => fetchOrders())
                .catch((error) => console.error('Error deleting order:', error));
        }
    };

    return (
        <div className="container mt-5">
            <h2 className="mb-4">Управління замовленнями</h2>
            <Form.Group controlId="statusFilter" className="mb-3">
                <Form.Label>Фільтр по статусу:</Form.Label>
                <Form.Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value || null)}>
                    <option value="">Всі</option>
                    <option value="pending">В очікуванні</option>
                    <option value="processing">В обробці</option>
                    <option value="completed">Завершено</option>
                </Form.Select>
            </Form.Group>

            <Table striped bordered hover>
                <thead>
                <tr>
                    <th>ID замовлення</th>
                    <th>Клієнт</th>
                    <th>Статус</th>
                    <th>Загальна ціна</th>
                    <th>Дія</th>
                </tr>
                </thead>
                <tbody>
                {orders.map(order => (
                    <tr key={order.id}>
                        <td>{order.id}</td>
                        <td>{order.user_id}</td>
                        <td>{order.status}</td>
                        <td>{order.total_price} грн</td>
                        <td>
                            <Button variant="info" size="sm" onClick={() => handleStatusChange(order.id, 'processing')}
                                    className="me-2">
                                В обробці
                            </Button>
                            <Button variant="success" size="sm"
                                    onClick={() => handleStatusChange(order.id, 'completed')} className="me-2">
                                Завершено
                            </Button>
                            <Button variant="warning" size="sm"
                                    onClick={() => fetchOrderDetails(order.id)} className="me-2">
                                Деталі
                            </Button>
                            <Button variant="danger" size="sm" onClick={() => handleDelete(order.id)}>
                                Видалити
                            </Button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </Table>

            <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Деталі замовлення</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {orderDetails ? (
                        <>
                            <h5>Інформація про доставку</h5>
                            <p><strong>Адреса:</strong> {orderDetails.shipping.address_line1}, {orderDetails.shipping.city}</p>
                            <p><strong>Ім'я:</strong> {orderDetails.shipping.guest_first_name} {orderDetails.shipping.guest_last_name}</p>
                            <p><strong>Телефон:</strong> {orderDetails.shipping.guest_phone_number}</p>
                            <hr />
                            <h5>Товари</h5>
                            <Table striped bordered hover>
                                <thead>
                                <tr>
                                    <th>Назва</th>
                                    <th>Кількість</th>
                                    <th>Розмір</th>
                                    <th>Ціна</th>
                                    <th>Загальна ціна</th>
                                </tr>
                                </thead>
                                <tbody>
                                {orderDetails.items.map((item) => (
                                    <tr key={item.id}>
                                        <td>{item.product_name}</td>
                                        <td>{item.quantity}</td>
                                        <td>{item.size || 'N/A'}</td>
                                        <td>{item.price} грн</td>
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
        </div>
    );
}

export default OrderManagement;
