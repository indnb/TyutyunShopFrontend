// src/components/admin/ProductManagement.js
import React, { useState, useEffect } from 'react';
import axios from '../axiosConfig';
import ProductForm from './ProductForm';
import { Table, Button, Modal } from 'react-bootstrap';

function ProductManagement() {
    const [products, setProducts] = useState([]);
    const [editingProduct, setEditingProduct] = useState(null);
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = () => {
        axios.get('/product')
            .then(response => setProducts(response.data))
            .catch(error => console.error('Error get product:', error));
    };

    const handleEdit = (product) => {
        setEditingProduct(product);
        setShowForm(true);
    };

    const handleDelete = (productId) => {
        if (window.confirm('Ви впевнені що потрібно видалити товар?')) {
            axios.delete(`/product/${productId}`)
                .then(() => fetchProducts())
                .catch(error => console.error('Error delete product:', error));
        }
    };

    const handleFormClose = () => {
        setEditingProduct(null);
        setShowForm(false);
        fetchProducts();
    };

    return (
        <div className="container mt-5">
            <h2 className="mb-4">Управління товарами</h2>
            <Button variant="primary" onClick={() => setShowForm(true)} className="mb-3">
                Додати новий товар
            </Button>

            <Table striped bordered hover>
                <thead>
                <tr>
                    <th>Назва</th>
                    <th>Ціна</th>
                    <th>Категорія</th>
                    <th>Дія</th>
                </tr>
                </thead>
                <tbody>
                {products.map(product => (
                    <tr key={product.id}>
                        <td>{product.name}</td>
                        <td>{product.price} грн</td>
                        <td>{product.category_name}</td>
                        <td>
                            <Button variant="warning" size="sm" onClick={() => handleEdit(product)} className="me-2">
                                Редагувати
                            </Button>
                            <Button variant="danger" size="sm" onClick={() => handleDelete(product.id)}>
                                Видалити
                            </Button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </Table>

            <Modal show={showForm} onHide={handleFormClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{editingProduct ? 'Редагувати товар' : 'Додати новий товар'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <ProductForm product={editingProduct} onClose={handleFormClose} />
                </Modal.Body>
            </Modal>
        </div>
    );
}

export default ProductManagement;
