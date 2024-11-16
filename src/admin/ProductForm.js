import React, { useState, useEffect } from 'react';
import axios from '../axiosConfig';
import { Form, Button } from 'react-bootstrap';

function ProductForm({ product, onClose }) {
    const [formData, setFormData] = useState({
        name: '',
        price: 0,
        description: '',
        category_id: 0,
        primary_image_id: 0,
    });
    const [sizes, setSizes] = useState({
        single_size: 0,
        s: 0,
        m: 0,
        l: 0,
        xl: 0,
        xxl: 0,
    });
    const [categories, setCategories] = useState([]);
    const [photos, setPhotos] = useState([]);

    useEffect(() => {
        fetchCategories();
        fetchPhotos();
        if (product) {
            setFormData(product);
            setSizes({
                single_size: 0,
                s: 0,
                m: 0,
                l: 0,
                xl: 0,
                xxl: 0,
            });
        }
    }, [product]);

    const fetchCategories = () => {
        axios.get('/categories')
            .then((response) => setCategories(response.data))
            .catch((error) => console.error('Error getting categories:', error));
    };

    const fetchPhotos = () => {
        axios.get('/product_image_all')
            .then((response) => setPhotos(response.data))
            .catch((error) => console.error('Error getting photos:', error));
    };

    const handleSizeChange = (size, value) => {
        setSizes((prevSizes) => ({
            ...prevSizes,
            [size]: Number(value),
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Sizes:", sizes);
        try {
            let createdProductId;

            if (product) {
                await axios.put(`/product/${product.id}`, formData);
                createdProductId = product.id;
            } else {
                const response = await axios.post('/product', formData);
                createdProductId = response.data;
            }

            if (createdProductId) {
                await axios.post('/size', { ...sizes, product_id: createdProductId });
                alert('Продукт та розміри успішно збережено!');
            } else {
                throw new Error('Failed to retrieve created product ID.');
            }

            onClose();
        } catch (error) {
            console.error('Error saving product or sizes:', error);
            alert('Помилка при збереженні продукту чи розмірів. Перевірте дані та спробуйте ще раз.');
        }
    };


    return (
        <Form onSubmit={handleSubmit}>
            <Form.Group controlId="productName">
                <Form.Label>Назва</Form.Label>
                <Form.Control
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                />
            </Form.Group>

            <Form.Group controlId="productPrice" className="mt-3">
                <Form.Label>Ціна</Form.Label>
                <Form.Control
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    required
                />
            </Form.Group>

            <Form.Group controlId="productDescription" className="mt-3">
                <Form.Label>Опис</Form.Label>
                <Form.Control
                    as="textarea"
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
            </Form.Group>

            <Form.Group controlId="productCategory" className="mt-3">
                <Form.Label>Категорія</Form.Label>
                <Form.Select
                    value={formData.category_id}
                    onChange={(e) => setFormData({ ...formData, category_id: Number(e.target.value) })}
                    required
                >
                    <option value="">Обрати категорію</option>
                    {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                            {cat.name}
                        </option>
                    ))}
                </Form.Select>
            </Form.Group>

            <Form.Group controlId="productImage" className="mt-3">
                <Form.Label>Основне фото</Form.Label>
                <div className="image-selection d-flex flex-wrap">
                    {photos.map((photo) => (
                        <div key={photo.id} className="image-option me-3 mb-3">
                            <Form.Check
                                type="radio"
                                name="primary_image_id"
                                id={`photo-${photo.id}`}
                                value={photo.id}
                                checked={String(formData.primary_image_id) === String(photo.id)}
                                onChange={(e) => setFormData({ ...formData, primary_image_id: Number(e.target.value) })}
                                label={
                                    <div>
                                        <img
                                            src={photo.image_url}
                                            style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                                        />
                                    </div>
                                }
                            />
                        </div>
                    ))}
                </div>
            </Form.Group>

            <Form.Group controlId="productSizes" className="mt-3">
                <Form.Label>Розміри</Form.Label>
                {["single_size", "s", "m", "l", "xl", "xxl"].map((size) => (
                    <Form.Control
                        key={size}
                        type="number"
                        placeholder={`Кількість розміру ${size}`}
                        onChange={(e) => handleSizeChange(size, e.target.value)}
                        className="mt-2"
                    />
                ))}
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
