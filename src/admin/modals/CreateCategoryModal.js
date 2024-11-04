// src/admin/modals/CreateCategoryModal.js

import React, { useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import axios from '../../axiosConfig';

function CreateCategoryModal({ show, onHide }) {
    const [name, setName] = useState('');

    const addCategory = async () => {
        try {
            await axios.post('/category', { name });
            setName('');
            onHide();
        } catch (error) {
            console.error('Error add new category:', error);
        }
    };

    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>Добавить новую категорию</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Control
                        placeholder="Назва категорії"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="outline-danger" onClick={onHide}>
                    Закрыть
                </Button>
                <Button variant="outline-success" onClick={addCategory}>
                    Добавить
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default CreateCategoryModal;
