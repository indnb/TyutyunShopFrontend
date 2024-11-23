import React, { useEffect, useState } from 'react';
import axios from '../axiosConfig';
import { Button, Form, Modal, Table } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { translateStatus } from '../utils/statusTranslation';

function OrderManagement() {
    const [orders, setOrders] = useState([]);
    const [statusFilter, setStatusFilter] = useState(null);
    const [orderDetails, setOrderDetails] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        fetchOrders();
    }, [statusFilter]);

    const fetchOrders = () => {
        axios.get('/orders', { params: { status: statusFilter } })
            .then((response) => {
                const sortedOrders = response.data.sort((a, b) => new Date(b.date) - new Date(a.date));
                setOrders(sortedOrders);
            })
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
        axios.put(`/order/${orderId}`, { status: newStatus })
            .then(() => fetchOrders())
            .catch((error) => console.error('Error updating order status:', error));
    };

    const handleDelete = (orderId) => {
        if (window.confirm('Ви впевнені що хочете видалити це замовлення?')) {
            axios.delete(`/order/${orderId}`)
                .then(() => fetchOrders())
                .catch((error) => console.error('Error deleting order:', error));
        }
    };

    const navigate = useHistory();

    return (
        <div className="orders-section container mt-5">
            <div className="margin-top">
                <h2 className="mb-4">Управління замовленнями</h2>
                <Button
                    variant="warning"
                    className="btn mb-4"
                    onClick={() => navigate.goBack()}
                    style={{ margin: 'auto', padding: '10px' }}
                >
                    Назад
                </Button>
            </div>
            <Form.Group controlId="statusFilter" className="mb-3">
                <Form.Label>Фільтр по статусу:</Form.Label>
                <Form.Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value || null)}>
                    <option value="">Всі</option>
                    <option value="pending">В очікуванні</option>
                    <option value="processing">В обробці</option>
                    <option value="completed">Завершено</option>
                </Form.Select>
            </Form.Group>

            <Table table-striped table-bordered table-hover>
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Клієнт</th>
                    <th>Статус</th>
                    <th>Загальна ціна</th>
                    <th>Дата створення</th>
                    <th>Дія</th>
                </tr>
                </thead>
                <tbody>
                {orders.map((order) => (
                    <tr key={order.id}>
                        <td>{order.id}</td>
                        <td>{order.user_id}</td>
                        <td>{translateStatus(order.status)}</td>
                        <td>{order.total_price} грн</td>
                        <td>{new Date(order.date).toLocaleDateString()}</td>
                        <td className="d-flex">
                            <Button
                                variant="info"
                                size="sm"
                                onClick={() => handleStatusChange(order.id, 'processing')}
                                className="me-2"
                            >
                                В обробку
                            </Button>
                            <Button
                                variant="info"
                                size="sm"
                                onClick={() => handleStatusChange(order.id, 'completed')}
                                className="me-2"
                            >
                                Завершити
                            </Button>
                            <Button variant="info" size="sm" className="me-2" onClick={() => handleDelete(order.id)}>
                                Видалити
                            </Button>
                            <Button
                                variant="info"
                                size="sm"
                                onClick={() => fetchOrderDetails(order.id)}
                                className="me-2"
                            >
                                Деталі
                            </Button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </Table>

            <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
                <Modal.Header>
                    <Modal.Title>Деталі замовлення</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {orderDetails ? (
                        <>
                            <h5>Інформація про доставку</h5>
                            <p><strong>Адреса:</strong> {orderDetails.shipping.address}</p>
                            <p>
                                <strong>Ім'я:</strong> {orderDetails.shipping.first_name} {orderDetails.shipping.last_name}
                            </p>
                            <p><strong>Телефон:</strong> {orderDetails.shipping.phone_number}</p>
                            <p><strong>Пошта:</strong> {orderDetails.shipping.email}</p>
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
                                <tbody>
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
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Закрити
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default OrderManagement;
