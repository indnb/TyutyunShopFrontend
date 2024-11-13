// src/components/AdminPage.js
import React from 'react';
import { Link } from 'react-router-dom';

function AdminPage() {
    return (
        <div className="container mt-5">
            <h1 className="mb-4">Тютюн панель)</h1>
            <div className="list-group">
                <Link to="/admin/products" className="list-group-item list-group-item-action">
                    Управління товарами
                </Link>
                <Link to="/admin/categories" className="list-group-item list-group-item-action">
                    Управління категоріями
                </Link>
                <Link to="/admin/orders" className="list-group-item list-group-item-action">
                    Управління замовленнями
                </Link>
                <Link to="/admin/photos" className="list-group-item list-group-item-action">
                    Управління фото
                </Link>
            </div>
        </div>
    );
}

export default AdminPage;
