import React, { useState, useEffect } from 'react';
import axios from '../axiosConfig';
import ProductForm from './ProductForm';
import { Table, Button, Modal } from 'react-bootstrap';

function ProductManagement() {
    const [products, setProducts] = useState([]);
    const [editingProduct, setEditingProduct] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, []);

    const fetchProducts = () => {
        axios.get('/product')
            .then(response => setProducts(response.data))
            .catch(error => console.error('Error fetching products:', error));
    };

    const fetchCategories = () => {
        axios.get('/categories')
            .then(response => setCategories(response.data))
            .catch(error => console.error('Error fetching categories:', error));
    };

    const handleEdit = (product) => {
        setEditingProduct(product);
        setShowForm(true);
    };

    const handleDelete = async (productId) => {
        if (window.confirm('Ви впевнені що потрібно видалити товар?')) {
            try {
                await axios.delete(`/product/${productId}`);
                fetchProducts();
            } catch (err) {
                console.error('Error deleting product:', err);
            }
        }
    };

    const handleFormClose = () => {
        setEditingProduct(null);
        setShowForm(false);
        fetchProducts();
    };

    const categoryMap = categories.reduce((acc, category) => {
        acc[category.id] = category.name;
        return acc;
    }, {});

    return (
        <div className="container mt-5">
            <h2 className="mb-4 margin-top">Управління товарами</h2>

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
                {products.length > 0 ? (
                    products.map((product) => (
                        <tr key={product.id}>
                            <td>{product.name}</td>
                            <td>{product.price} грн</td>
                            <td>{categoryMap[product.category_id] || 'Категорія не знайдена'}</td>
                            <td>
                                <Button
                                    variant="warning"
                                    size="sm"
                                    onClick={() => handleEdit(product)}
                                    className="me-2"
                                >
                                    Редагувати
                                </Button>
                                <Button
                                    variant="danger"
                                    size="sm"
                                    onClick={() => handleDelete(product.id)}
                                >
                                    Видалити
                                </Button>
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="4" className="text-center">
                            Немає товарів для відображення.
                        </td>
                    </tr>
                )}
                </tbody>
            </Table>

            <Modal show={showForm} onHide={handleFormClose}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        {editingProduct ? 'Редагувати товар' : 'Додати новий товар'}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <ProductForm product={editingProduct} onClose={handleFormClose} />
                </Modal.Body>
            </Modal>
        </div>
    );
}

export default ProductManagement;