// src/components/admin/ProductForm.js
import React, { useState, useEffect } from 'react';
import axios from '../axiosConfig';
import { Form, Button } from 'react-bootstrap';

function ProductForm({ product, onClose }) {
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        description: '',
        category_id: '',
        primary_image_id: '',
    });
    const [categories, setCategories] = useState([]);
    const [photos, setPhotos] = useState([]);

    useEffect(() => {
        fetchCategories();
        fetchPhotos();
        if (product) {
            setFormData(product);
        }
    }, [product]);

    const fetchCategories = () => {
        axios.get('/categories')
            .then(response => setCategories(response.data))
            .catch(error => console.error('Error get categories:', error));
    };

    const fetchPhotos = () => {
        axios.get('/product_image_all')
            .then(response => setPhotos(response.data))
            .catch(error => console.error('Error get photos:', error));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (product) {
            axios.put(`/product/${product.id}`, formData)
                .then(() => onClose())
                .catch(error => console.error('Error update product:', error));
        } else {
            axios.post('/product', formData)
                .then(() => onClose())
                .catch(error => console.error('Error add product', error));
        }
    };

    return (
        <Form onSubmit={handleSubmit}>
            <Form.Group controlId="productName">
                <Form.Label>Назва</Form.Label>
                <Form.Control
                    type="text"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    required
                />
            </Form.Group>

            <Form.Group controlId="productPrice" className="mt-3">
                <Form.Label>Ціна</Form.Label>
                <Form.Control
                    type="number"
                    value={formData.price}
                    onChange={e => setFormData({...formData, price: e.target.value})}
                    required
                />
            </Form.Group>

            <Form.Group controlId="productDescription" className="mt-3">
                <Form.Label>Опис</Form.Label>
                <Form.Control
                    as="textarea"
                    rows={3}
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                />
            </Form.Group>

            <Form.Group controlId="productCategory" className="mt-3">
                <Form.Label>Категорія</Form.Label>
                <Form.Select
                    value={formData.category_id}
                    onChange={e => setFormData({...formData, category_id: e.target.value})}
                    required
                >
                    <option value="">Обрати категорію</option>
                    {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                </Form.Select>
            </Form.Group>

            <Form.Group controlId="productImage" className="mt-3">
                <Form.Label>Основне фото</Form.Label>
                <div className="image-selection d-flex flex-wrap">
                    {photos.map(photo => (
                        <div key={photo.id} className="image-option me-3 mb-3">
                            <Form.Check
                                type="radio"
                                name="primary_image_id"
                                id={`photo-${photo.id}`}
                                value={photo.id}
                                checked={String(formData.primary_image_id) === String(photo.id)}
                                onChange={e => setFormData({ ...formData, primary_image_id: e.target.value })}
                                label={
                                    <div>
                                        <img src={photo} thumbnail style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
                                    </div>
                                }
                            />
                        </div>
                    ))}
                </div>
            </Form.Group>

            <Button variant="primary" type="submit" className="mt-4">
                {product ? 'Оновити' : 'Додати'}
            </Button>
            <Button variant="secondary" onClick={onClose} className="mt-4 ms-2">
                Відмінити
            </Button>
        </Form>
    );
}

export default ProductForm;
