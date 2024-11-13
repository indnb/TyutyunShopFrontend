// src/components/admin/OrderManagement.js
import React, { useState, useEffect } from 'react';
import axios from '../axiosConfig';
import { Table, Button, Form } from 'react-bootstrap';

function OrderManagement() {
    const [orders, setOrders] = useState([]);
    const [statusFilter, setStatusFilter] = useState('');

    useEffect(() => {
        fetchOrders();
    }, [statusFilter]);

    const fetchOrders = () => {
        axios.get('/orders', { params: { status: statusFilter } })
            .then(response => setOrders(response.data))
            .catch(error => console.error('Error get order:', error));
    };

    const handleStatusChange = (orderId, newStatus) => {
        axios.put(`/orders/${orderId}`, { status: newStatus })
            .then(() => fetchOrders())
            .catch(error => console.error('Error update status order:', error));
    };

    const handleDelete = (orderId) => {
        if (window.confirm('Ви впевнені що хочете видалити це замовлення?')) {
            axios.delete(`/orders/${orderId}`)
                .then(() => fetchOrders())
                .catch(error => console.error('Error delete order:', error));
        }
    };

    return (
        <div className="container mt-5">
            <h2 className="mb-4">Управління замовленнями</h2>
            <Form.Group controlId="statusFilter" className="mb-3">
                <Form.Label>Фільтр по статусу:</Form.Label>
                <Form.Select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                    <option value="">Всі</option>
                    <option value="pending">В очікуванні</option>
                    <option value="processing">В обробці</option>
                    <option value="completed">Заверешно</option>
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
                        <td>{order.customer_name}</td>
                        <td>{order.status}</td>
                        <td>{order.total_cost} грн</td>
                        <td>
                            <Button variant="info" size="sm" onClick={() => handleStatusChange(order.id, 'processing')} className="me-2">
                                В обробці
                            </Button>
                            <Button variant="success" size="sm" onClick={() => handleStatusChange(order.id, 'completed')} className="me-2">
                                Завершено
                            </Button>
                            <Button variant="danger" size="sm" onClick={() => handleDelete(order.id)}>
                                Видалити
                            </Button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </Table>
        </div>
    );
}

export default OrderManagement;
