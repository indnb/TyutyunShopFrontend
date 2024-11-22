// src/components/admin/CategoryManagement.js
import React, {useEffect, useState} from 'react';
import axios from '../axiosConfig';
import {Button, Form, Modal, Table} from 'react-bootstrap';

function CategoryManagement() {
    const [categories, setCategories] = useState([]);
    const [editingCategory, setEditingCategory] = useState(null);
    const [categoryName, setCategoryName] = useState('');
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = () => {
        axios.get('/categories')
            .then(response => setCategories(response.data))
            .catch(error => console.error('Error get categories:', error));
    };

    const handleEdit = (category) => {
        setEditingCategory(category);
        setCategoryName(category.name);
        setShowForm(true);
    };

    const handleDelete = (categoryId) => {
        if (window.confirm('Ви впевнені що хочете видалити цю категорію?')) {
            axios.delete(`/category/${categoryId}`)
                .then(() => fetchCategories())
                .catch(error => console.error('Error delete category:', error));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingCategory) {
            axios.put(`/category/${editingCategory.id}`, { name: categoryName })
                .then(() => {
                    setEditingCategory(null);
                    setCategoryName('');
                    setShowForm(false);
                    fetchCategories();
                })
                .catch(error => console.error('Error update category:', error));
        } else {
            axios.post('/category', { name: categoryName })
                .then(() => {
                    setCategoryName('');
                    setShowForm(false);
                    fetchCategories();
                })
                .catch(error => console.error('Error add category:', error));
        }
    };

    const handleFormClose = () => {
        setEditingCategory(null);
        setCategoryName('');
        setShowForm(false);
    };

    return (
        <div className="orders-section container mt-8">
            <h2 className="mb-4">Управління категоріями</h2>
            <Button variant="warning" onClick={() => setShowForm(true)} className="mb-3">
                Додати категорію
            </Button>

            <Table table table-striped table-bordered table-hover>
                <thead>
                <tr>
                    <th>Назва</th>
                    <th>Дія</th>
                </tr>
                </thead>
                <tbody>
                {categories.map(cat => (
                    <tr key={cat.id}>
                        <td>{cat.name}</td>
                        <td>
                            <Button variant="info" size="sm" onClick={() => handleEdit(cat)} className="me-2">
                                Редагувати
                            </Button>
                            <Button variant="info" size="sm" onClick={() => handleDelete(cat.id)}>
                                Видалити
                            </Button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </Table>

            <Modal show={showForm} onHide={handleFormClose}>
                <Modal.Header>
                    <Modal.Title>{editingCategory ? 'Редагування категорії' : 'Додати котегорії'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="categoryName">
                            <Form.Label>Назва категорії</Form.Label>
                            <Form.Control
                                type="text"
                                value={categoryName}
                                onChange={e => setCategoryName(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Button variant="warning" type="submit" className="mt-3">
                            {editingCategory ? 'Оновити' : 'Додати'}
                        </Button>
                        <Button variant="secondary" onClick={handleFormClose} className="mt-3 ms-2">
                            Відмінити
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
}

export default CategoryManagement;
