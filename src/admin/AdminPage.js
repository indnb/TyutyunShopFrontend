import React, { useContext, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './AdminPage.css'
function AdminPage() {
    const { isAdmin, checkAuth } = useContext(AuthContext);
    const history = useHistory();

    useEffect(() => {
        const verifyAccess = async () => {
            await checkAuth();
            if (!isAdmin) {
                history.push('/profile');
            }
        };
        verifyAccess();
    }, [isAdmin, checkAuth, history]);

    return (
        <div className="container">
            <h1 className="margin-top">Тютюн Панель</h1>
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
