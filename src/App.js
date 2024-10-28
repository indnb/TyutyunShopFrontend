// App.js

import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Template from './template/Template';
import Landing from './landing/Landing';
import ProductList from './products/ProductList';
import ProductDetail from './products/detail/ProductDetail';
import CartPage from './cart/CartPage';
import LoginPage from './Auth/LoginPage';
import RegisterPage from './Auth/RegisterPage';
import UserProfile from './user/UserProfile';
import AdminPage from './admin/AdminPage';

function App() {
    return (
        <Template>
            <Switch>
                <Route path="/" exact component={Landing} />
                <Route path="/products/category/:category" exact component={ProductList} />
                <Route path="/products/:slug" component={ProductDetail} />
                <Route path="/cart" component={CartPage} />
                <Route path="/login" component={LoginPage} />
                <Route path="/register" component={RegisterPage} />
                <Route path="/user/profile" component={UserProfile} />
                <Route path="/admin" component={AdminPage} />
            </Switch>
        </Template>
    );
}

export default App;
