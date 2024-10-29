// src/admin/AdminPage.js

import React, { useState } from 'react';
import { Button, Container } from 'react-bootstrap';
import CreateProductModal from './modals/CreateProductModal';
import CreateCategoryModal from './modals/CreateCategoryModal';

function AdminPage() {
    const [productModalVisible, setProductModalVisible] = useState(false);
    const [categoryModalVisible, setCategoryModalVisible] = useState(false);

    return (
        <Container className="d-flex flex-column">
            <Button
                variant="outline-dark"
                className="mt-4 p-2"
                onClick={() => setCategoryModalVisible(true)}
            >
                Добавить категорию
            </Button>
            <Button
                variant="outline-dark"
                className="mt-4 p-2"
                onClick={() => setProductModalVisible(true)}
            >
                Добавить товар
            </Button>

            <CreateCategoryModal
                show={categoryModalVisible}
                onHide={() => setCategoryModalVisible(false)}
            />
            <CreateProductModal
                show={productModalVisible}
                onHide={() => setProductModalVisible(false)}
            />
        </Container>
    );
}

export default AdminPage;
