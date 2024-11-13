import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, ListGroup } from 'react-bootstrap';
import axios from '../../axiosConfig';

function ManagePhotosModal({ show, onHide, onPhotoSelect }) {
    const [photos, setPhotos] = useState([]);
    const [newPhoto, setNewPhoto] = useState(null);

    useEffect(() => {
        if (show) fetchPhotos();
    }, [show]);

    const fetchPhotos = async () => {
        try {
            const response = await axios.get('/photos');
            setPhotos(response.data);
        } catch (error) {
            console.error('Error fetching photos:', error);
        }
    };

    const handlePhotoUpload = async () => {
        if (!newPhoto) return;
        const formData = new FormData();
        formData.append('image', newPhoto);

        try {
            const response = await axios.post('/upload_photo', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setPhotos([...photos, response.data]);
            setNewPhoto(null);
        } catch (error) {
            console.error('Error uploading photo:', error);
        }
    };

    const handleDeletePhoto = async (photoId) => {
        try {
            await axios.delete(`/photos/${photoId}`);
            setPhotos(photos.filter((photo) => photo.id !== photoId));
        } catch (error) {
            console.error('Error deleting photo:', error);
        }
    };

    return (
        <Modal show={show} onHide={onHide} centered size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Управление фотографиями</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Control
                        type="file"
                        onChange={(e) => setNewPhoto(e.target.files[0])}
                    />
                    <Button variant="outline-success" onClick={handlePhotoUpload} className="mt-3">
                        Загрузить фото
                    </Button>
                </Form>
                <ListGroup className="mt-3">
                    {photos.map((photo) => (
                        <ListGroup.Item key={photo.id}>
                            <img src={photo.url} alt="product" width="50" height="50" />
                            <Button variant="outline-danger" size="sm" onClick={() => handleDeletePhoto(photo.id)}>
                                Удалить
                            </Button>
                            <Button variant="outline-primary" size="sm" onClick={() => onPhotoSelect(photo)}>
                                Выбрать
                            </Button>
                        </ListGroup.Item>
                    ))}
                </ListGroup>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="outline-danger" onClick={onHide}>Закрыть</Button>
            </Modal.Footer>
        </Modal>
    );
}

export default ManagePhotosModal;
