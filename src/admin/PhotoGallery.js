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

    const fetchPhotos = async () => {
        try {
            const response = await axios.get('/product_image_all');
            setPhotos(response.data);
        } catch (error) {
            console.error('Error fetching photos:', error);
        }
    };

    const handleDelete = async (photoId) => {
        if (window.confirm('Ви впевнені що хочете видалити це фото?')) {
            try {
                await axios.delete(`/product_image/${photoId}`);
                fetchPhotos();
            } catch (error) {
                console.error('Error deleting photo:', error);
            }
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
            console.error('Error uploading photo:', error);
        }
    };

    return (
        <div className="container mt-5">
            <h2 className="mb-4 margin-top">Управління фото</h2>

            <Form onSubmit={handleUpload} className="mb-4">
                <Form.Group controlId="formFile" className="mb-3">
                    <Form.Label>Завантажити нове фото</Form.Label>
                    <Form.Control type="file" onChange={e => setNewPhotoFile(e.target.files[0])} required />
                </Form.Group>
                <Button variant="primary" type="submit">
                    Завантажити
                </Button>
            </Form>

            {photos.length > 0 ? (
                <Row xs={1} md={6} className="g-4">
                    {photos.map(photo => (
                        <Col key={photo.id}>
                            <Card>
                                <Card.Img variant="top" src={photo.image_url} alt="Фото товару" style={{width: 200}}/>
                                <Card.Body style={{margin: 'auto'}}>
                                    <Button variant="danger" onClick={() => handleDelete(photo.id)}>
                                        Видалити
                                    </Button>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            ) : (
                <p>Немає доступних фото для відображення.</p>
            )}
        </div>
    );
}

export default PhotoGallery;
