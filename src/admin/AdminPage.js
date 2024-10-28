// admin/AdminPage.js

import React, { useState, useEffect } from 'react';
import './AdminPage.css';

function AdminPage() {
    const [products, setProducts] = useState([]);
    const [editingProduct, setEditingProduct] = useState(null);

    useEffect(() => {
        // Получить список товаров из API
        // setProducts([...]);
    }, []);

    const handleAddProduct = () => {
        // Логика добавления товара
    };

    const handleEditProduct = product => {
        setEditingProduct(product);
    };

    const handleSaveProduct = () => {
        // Логика сохранения изменений товара
    };

    const handleDeleteProduct = productId => {
        // Логика удаления товара
    };

    return (
        <div className="admin-page">
            <h1>Адмін-панель</h1>
            <button onClick={handleAddProduct}>Додати товар</button>
            {/* Блок добавления или редактирования товара */}
            {editingProduct && (
                <div className="product-edit">
                    <h2>{editingProduct.id ? 'Редагувати товар' : 'Додати товар'}</h2>
                    <form onSubmit={handleSaveProduct}>
                        {/* Поля редактирования товара */}
                        <button type="submit">Зберегти</button>
                        <button type="button" onClick={() => setEditingProduct(null)}>
                            Відмінити
                        </button>
                    </form>
                </div>
            )}
            {/* Список товаров */}
            <table className="admin-table">
                <thead>
                <tr>
                    <th>Фото</th>
                    <th>Назва</th>
                    <th>Ціна</th>
                    <th>Дії</th>
                </tr>
                </thead>
                <tbody>
                {products.map(product => (
                    <tr key={product.id}>
                        <td>
                            <img src={product.image} alt={product.name} width="50" />
                        </td>
                        <td>{product.name}</td>
                        <td>{product.price} грн</td>
                        <td>
                            <button onClick={() => handleEditProduct(product)}>Редагувати</button>
                            <button onClick={() => handleDeleteProduct(product.id)}>Видалити</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

export default AdminPage;
