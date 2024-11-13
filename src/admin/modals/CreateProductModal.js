import React, { useState, useEffect } from 'react';
import { Button, Dropdown, Form, Modal } from 'react-bootstrap';
import ManagePhotosModal from './ManagePhotosModal';
import axios from '../../axiosConfig';

function CreateProductModal({ show, onHide }) {
    const [categories, setCategories] = useState([]);
    const [productData, setProductData] = useState({
        name: '',
        price: 0,
        category_id: null,
        photo_id: null,
    });
    const [showPhotoModal, setShowPhotoModal] = useState(false);
    const [selectedPhoto, setSelectedPhoto] = useState(null);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await axios.get('/categories');
            setCategories(response.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const handlePhotoSelect = (photo) => {
        setSelectedPhoto(photo);
        setProductData({ ...productData, photo_id: photo.id });
        setShowPhotoModal(false);
    };

    const addProduct = async () => {
        try {
            const formData = new FormData();
            formData.append('name', productData.name);
            formData.append('price', productData.price);
            formData.append('category_id', productData.category_id);
            formData.append('photo_id', productData.photo_id);

            const response = await axios.post('/product_image', formData);
            console.log('Server response:', response.data);

            setProductData({ name: '', price: 0, category_id: null, photo_id: null });
            setSelectedPhoto(null);
            onHide();
        } catch (error) {
            console.error('Error adding product:', error);
        }
    };

    return (
        <>
            <Modal show={show} onHide={onHide} centered size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Добавить новый товар</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Control
                            className="mt-3"
                            placeholder="Название товара"
                            value={productData.name}
                            onChange={(e) => setProductData({ ...productData, name: e.target.value })}
                        />
                        <Form.Control
                            className="mt-3"
                            placeholder="Цена товара"
                            type="number"
                            value={productData.price}
                            onChange={(e) => setProductData({ ...productData, price: Number(e.target.value) })}
                        />
                        <Dropdown className="mt-3">
                            <Dropdown.Toggle>
                                {productData.category_id ? categories.find((cat) => cat.id === productData.category_id)?.name : 'Выберите категорию'}
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                {categories.map((category) => (
                                    <Dropdown.Item
                                        key={category.id}
                                        onClick={() => setProductData({ ...productData, category_id: category.id })}
                                    >
                                        {category.name}
                                    </Dropdown.Item>
                                ))}
                            </Dropdown.Menu>
                        </Dropdown>
                        <Button variant="outline-primary" className="mt-3" onClick={() => setShowPhotoModal(true)}>
                            {selectedPhoto ? 'Изменить фото' : 'Добавить фото'}
                        </Button>
                        {selectedPhoto && (
                            <div className="mt-3">
                                <img src={selectedPhoto.url} alt="Selected" width="100" height="100" />
                            </div>
                        )}
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="outline-danger" onClick={onHide}>
                        Закрыть
                    </Button>
                    <Button variant="outline-success" onClick={addProduct}>
                        Добавить
                    </Button>
                </Modal.Footer>
            </Modal>
            <ManagePhotosModal
                show={showPhotoModal}
                onHide={() => setShowPhotoModal(false)}
                onPhotoSelect={handlePhotoSelect}
            />
        </>
    );
}

export default CreateProductModal;
