import React, { useState, useEffect } from 'react';
import { Button, Col, Dropdown, Form, Modal, Row } from 'react-bootstrap';
import axios from '../../axiosConfig';

function CreateProductModal({ show, onHide }) {
    const [categories, setCategories] = useState([]);
    const [productData, setProductData] = useState({
        name: '',
        price: 0,
        category_id: null,
    });
    const [file, setFile] = useState(null);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await axios.get('/categories');
            setCategories(response.data);
        } catch (error) {
            console.error('Error get category:', error);
        }
    };

    const selectFile = (e) => {
        setFile(e.target.files[0]);
    };

    const addProduct = async () => {
        try {
            const formData = new FormData();
            formData.append('name', productData.name);
            formData.append('price', productData.price);
            formData.append('category_id', 2);
            formData.append('image', file);

            const response = await axios.post('/product_image', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log('Answer from server:', response.data);

            setProductData({ name: '', price: 0, category_id: null });
            setFile(null);
            onHide();
        } catch (error) {
            console.error('Error add new product:', error.response?.data || error.message);
        }
    };



    return (
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
                        onChange={(e) =>
                            setProductData({ ...productData, name: e.target.value })
                        }
                    />
                    <Form.Control
                        className="mt-3"
                        placeholder="Цена товара"
                        type="number"
                        value={productData.price}
                        onChange={(e) =>
                            setProductData({ ...productData, price: Number(e.target.value) })
                        }
                    />
                    <Dropdown className="mt-3">
                        <Dropdown.Toggle>
                            {productData.category_id
                                ? categories.find((cat) => cat.id === productData.category_id)
                                    ?.name
                                : 'Выберите категорию'}
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            {categories.map((category) => (
                                <Dropdown.Item
                                    key={category.id}
                                    onClick={() =>
                                        setProductData({ ...productData, category_id: category.id })
                                    }
                                >
                                    {category.name}
                                </Dropdown.Item>
                            ))}
                        </Dropdown.Menu>
                    </Dropdown>
                    <Form.Control
                        className="mt-3"
                        type="file"
                        onChange={selectFile}
                    />
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
    );
}

export default CreateProductModal;
