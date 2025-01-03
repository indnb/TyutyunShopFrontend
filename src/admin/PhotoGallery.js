import React, {useEffect, useState} from 'react';
import axios from '../axiosConfig';
import {Button, Card, Col, Form, Row} from 'react-bootstrap';
import {useHistory} from "react-router-dom";

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
                params: {position: null},
                headers: {'Content-Type': 'multipart/form-data'},
            });
            setNewPhotoFile(null);
            fetchPhotos();
        } catch (error) {
            console.error('Error uploading photo:', error);
        }
    };
    const navigate = useHistory();
    return (
        <div className="container mt-5">
            <div>
                <h2 className="mb-4 margin-top">Управління фото</h2>
                <Button
                    variant="warning"
                    className="btn mb-4"
                    onClick={() => navigate.goBack()}
                    style={{margin: "auto", padding: "10px"}}
                >
                    Назад
                </Button>
            </div>
            <Form onSubmit={handleUpload} className="mb-4">
                <Form.Group controlId="formFile" className="mb-3">
                    <Form.Label column={"sm"}>Завантажити нове фото</Form.Label>
                    <Form.Control type="file" onChange={e => setNewPhotoFile(e.target.files[0])} required/>
                </Form.Group>
                <Button variant="warning" type="submit">
                    Завантажити
                </Button>
            </Form>

            {photos.length > 0 ? (
                <Row className="g-4">
                    {photos.map(photo => (
                        <Col key={photo.id}>
                            <Card>
                                <Card.Img variant="top" src={photo.image_url} alt="Фото товару"/>
                                <Card.Body style={{margin: 'auto'}}>
                                    <Button variant="warning" onClick={() => handleDelete(photo.id)}>
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
