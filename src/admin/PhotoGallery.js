// src/components/admin/PhotoGallery.js
import React, { useState, useEffect } from 'react';
import axios from '../axiosConfig';
import { Button, Form, Card, Col, Row } from 'react-bootstrap';

function PhotoGallery() {
    const [photos, setPhotos] = useState([]);
    const [newPhotoFile, setNewPhotoFile] = useState(null);
    const [productId, setProductId] = useState('');
    useEffect(() => {
        fetchPhotos();
    }, []);

    const fetchPhotos = () => {
        axios.get('/product_image_all')
            .then(response => setPhotos(response.data))
            .catch(error => console.error('Error get photos:', error));
    };

    const handleDelete = (photoId) => {
        if (window.confirm('Ви впевнені що хочете вдиалити це фото?')) {
            axios.delete(`/product_image/${photoId}`)
                .then(() => fetchPhotos())
                .catch(error => console.error('Error delete photo:', error));
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!newPhotoFile) {
            return;
        }

        const formData = new FormData();
        formData.append('image', newPhotoFile);
        if (productId) {
            formData.append('product_id', productId);
        }

        try {
            await axios.post('/product_image', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setNewPhotoFile(null);
            fetchPhotos();
        } catch (error) {
            console.error('Ошибка при загрузке фото:', error);
        }
    };

    return (
        <div className="container mt-5">
            <h2 className="mb-4">Управління фото</h2>
            <Form onSubmit={handleUpload} className="mb-4">
                <Form.Group controlId="formFile" className="mb-3">
                    <Form.Label>Завантажити нове фото</Form.Label>
                    <Form.Control type="file" onChange={e => setNewPhotoFile(e.target.files[0])} required />
                </Form.Group>
                <Button variant="primary" type="submit">
                    Завантажити
                </Button>
            </Form>

            <Row xs={1} md={3} className="g-4">
                {photos.map(photo => (
                    <Col key={photo.id}>
                        <Card>
                            <Card.Img variant="top" src={photo} />
                            <Card.Body>
                                <Button variant="danger" onClick={() => handleDelete(photo.id)}>
                                    Видалити
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </div>
    );
}

export default PhotoGallery;
