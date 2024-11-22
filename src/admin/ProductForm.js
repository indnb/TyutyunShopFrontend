import React, { useEffect, useState } from 'react';
import axios from '../axiosConfig';
import { Button, Form } from 'react-bootstrap';
import './PproductForm.css';

function ProductForm({ product, onClose }) {
    const [formData, setFormData] = useState({
        name: '',
        price: 0,
        description: '',
        category_id: null,
        primary_image_id: null,
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
    const [newPhoto, setNewPhoto] = useState(null);
    const [allPhotos, setAllPhotos] = useState([]);

    useEffect(() => {
        fetchCategories();
        fetchAllPhotos();
        if (product) {
            fetchPhotosByProductId();
            setFormData(product);
            fetchSizesByProductId();
        }
    }, [product]);

    const fetchCategories = async () => {
        try {
            const response = await axios.get('/categories');
            setCategories(response.data);
        } catch (error) {
            console.error('Error getting categories:', error);
        }
    };

    const fetchSizesByProductId = async () => {
        try {
            const response = await axios.get(`/size/${product.id}`);
            setSizes(response.data);
        } catch (error) {
            console.error('Error fetching sizes:', error);
        }
    };

    const fetchPhotosByProductId = async () => {
        try {
            const response = await axios.get('/product_image_all', { params: { product_id: product.id } });
            const photosWithSelection = response.data.map((photo) => ({
                ...photo,
                selected: true,
                isNew: false,
            }));
            setPhotos(photosWithSelection);
        } catch (error) {
            console.error('Error fetching photos:', error);
        }
    };

    const fetchAllPhotos = async () => {
        try {
            const response = await axios.get('/product_image_all');
            setAllPhotos(response.data);
        } catch (error) {
            console.error('Error fetching all photos:', error);
        }
    };

    const handleSizeChange = (size, value) => {
        setSizes((prevSizes) => ({
            ...prevSizes,
            [size]: Number(value),
        }));
    };

    const handlePhotoPositionChange = (photoId, position) => {
        setPhotos((prevPhotos) =>
            prevPhotos.map((photo) =>
                photo.id === photoId ? { ...photo, position: Number(position) } : photo
            )
        );
    };

    const handlePhotoAdd = (photo) => {
        setPhotos((prevPhotos) => {
            const photoExists = prevPhotos.find((p) => p.id === photo.id);
            if (photoExists) {
                return prevPhotos.map((p) => (p.id === photo.id ? { ...p, selected: true } : p));
            } else {
                return [...prevPhotos, { ...photo, selected: true, isNew: false }];
            }
        });
    };

    const handlePhotoRemove = (photoId) => {
        setPhotos((prevPhotos) =>
            prevPhotos.map((photo) =>
                photo.id === photoId ? { ...photo, selected: false } : photo
            )
        );
    };

    const handlePhotoUpload = () => {
        if (!newPhoto) {
            alert('Please select a photo to upload.');
            return;
        }

        const newUploadedPhoto = {
            id: Date.now(),
            file: newPhoto,
            image_url: URL.createObjectURL(newPhoto),
            position: null,
            isNew: true,
            selected: true,
        };

        setPhotos((prevPhotos) => [...prevPhotos, newUploadedPhoto]);
        setNewPhoto(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let createdProductId;

            if (product) {
                await axios.put(`/product/update`, { ...formData, id: product.id });
                createdProductId = product.id;
            } else {
                const response = await axios.post('/product', formData);
                createdProductId = response.data;
            }

            if (product) {
                await axios.put('/size/update', { ...sizes });
            } else {
                await axios.post('/size', { product_id: createdProductId, ...sizes  });
            }

            for (const photo of photos) {
                if (photo.selected) {
                    if (photo.isNew) {
                        const photoFormData = new FormData();
                        photoFormData.append('image', photo.file);
                        photoFormData.append('product_id', createdProductId);
                        if (photo.position) photoFormData.append('position', photo.position);

                        await axios.post('/product_image', photoFormData, {
                            headers: { 'Content-Type': 'multipart/form-data' },
                        });
                    } else {
                        await axios.put(`/product_image/update`, {
                            ...photo,
                            product_id: createdProductId,
                        });
                    }
                } else {
                    if (!photo.isNew && photo.product_id === createdProductId) {
                        await axios.put(`/product_image/update`, {
                            ...photo,
                            product_id: null,
                        });
                    }
                }
            }

            alert('Продукт, розміри, та фотографії успішно збережені!');
            onClose();
        } catch (error) {
            console.error('Error saving product data:', error);
            alert('Помилка при збереженні даних. Перевірте введену інформацію.');
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

            <Form.Group controlId="productSizes" className="mt-3">
                <Form.Label>Розміри</Form.Label>
                <div className="d-flex flex-wrap">
                    {Object.keys(sizes).map((sizeKey) => (
                        <Form.Group key={sizeKey} className="me-3 mb-3">
                            <Form.Label>{sizeKey.toUpperCase()}</Form.Label>
                            <Form.Control
                                value={sizes[sizeKey]}
                                onChange={(e) => handleSizeChange(sizeKey, e.target.value)}
                            />
                        </Form.Group>
                    ))}
                </div>
            </Form.Group>

            <Form.Group controlId="productImages" className="mt-6">
                <Form.Label>Фотографії</Form.Label>
                <div className="image-selection d-flex flex-wrap">
                    {photos
                        .filter((photo) => photo.selected)
                        .map((photo) => (
                            <div key={photo.id} className="image-option me-3 mb-3">
                                <img
                                    src={photo.image_url}
                                    alt={`Photo ${photo.id}`}
                                />
                                <Form.Control
                                    placeholder="Позиція"
                                    value={photo.position || ''}
                                    onChange={(e) => handlePhotoPositionChange(photo.id, e.target.value)}
                                    className="mt-2"
                                />
                                <Button
                                    variant="danger"
                                    size="sm"
                                    onClick={() => handlePhotoRemove(photo.id)}
                                >
                                    Видалити
                                </Button>
                            </div>
                        ))}
                </div>
                <Form.Group className="mt-3">
                    <Form.Label>Додати існуюче фото</Form.Label>
                    <div className="d-flex flex-wrap mt-2">
                        {allPhotos.map((photo) => (
                            <div
                                key={photo.id}
                                style={{
                                    margin: '5px',
                                    cursor: 'pointer',
                                    border: '1px solid #ddd',
                                    padding: '3px',
                                    opacity: photos.find((p) => p.id === photo.id && p.selected)
                                        ? 0.5
                                        : 1,
                                }}
                                onClick={() => handlePhotoAdd(photo)}
                            >
                                <img
                                    src={photo.image_url}
                                    alt={`Photo ${photo.id}`}
                                    style={{ width: '100px', height: '100px'}}
                                />
                            </div>
                        ))}
                    </div>
                </Form.Group>
                <Form.Control
                    type="file"
                    onChange={(e) => setNewPhoto(e.target.files[0])}
                    className="mt-2"
                />
                <Button variant="warning" className="mt-2" onClick={handlePhotoUpload}>
                    Завантажити нове фото
                </Button>
            </Form.Group>

            <Button variant="warning" type="submit" className="mt-4 btn">
                {product ? 'Оновити' : 'Додати'}
            </Button>
            <Button variant="secondary" onClick={onClose} className="mt-4 ms-2 btn">
                Відмінити
            </Button>
        </Form>
    );
}

export default ProductForm;
