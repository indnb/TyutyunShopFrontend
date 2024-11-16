import React from 'react';
import {Route, Switch} from 'react-router-dom';
import Template from './template/Template';
import Landing from './landing/Landing';
import ProductList from './products/ProductList';
import ProductDetail from './products/detail/ProductDetail';
import CartPage from './cart/CartPage';
import LoginPage from './Auth/LoginPage';
import RegisterPage from './Auth/RegisterPage';
import UserProfile from './user/UserProfile';
import AdminPage from './admin/AdminPage';
import PrivateRoute from "./PrivateRoute";
import './App.css';
import OrderManagement from "./admin/OrderManagement";
import PhotoGallery from "./admin/PhotoGallery";
import CategoryManagement from "./admin/CategoryManagement";
import ProductManagement from "./admin/ProductManagement";

function App() {
    return (
        <Template>
            <Switch>
                <Route path="/" exact component={Landing} />
                <Route path="/products/category/:category" exact component={ProductList} />
                <Route path="/product/:id" component={ProductDetail} />
                <Route path="/cart" component={CartPage} />
                <Route path="/login" component={LoginPage} />
                <Route path="/register" component={RegisterPage} />
                <PrivateRoute path="/admin" exact component={AdminPage} />
                <PrivateRoute path="/admin/products" component={ProductManagement} />
                <PrivateRoute path="/admin/categories" component={CategoryManagement} />
                <PrivateRoute path="/admin/orders" component={OrderManagement} />
                <PrivateRoute path="/admin/photos" component={PhotoGallery} />
                <PrivateRoute path="/user/profile" component={UserProfile} />
            </Switch>
        </Template>
    );
}

export default App;
