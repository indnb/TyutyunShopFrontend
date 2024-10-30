import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from '../axiosConfig';
import ScrollToTopOnMount from "../template/ScrollToTopOnMount";
import './ProductList.css';

function ProductList() {
    const { category } = useParams();
    const [products, setProducts] = useState([]);
    const [categoryName, setCategoryName] = useState("");

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = category
                    ? await axios.get(`/product`, { params: { category_id: category } })
                    : await axios.get('/product');

                console.log("Get product:", response.data);
                setProducts(response.data.rows || response.data);
            } catch (error) {
                console.error('Error get product', error);
                setProducts([
                    {
                        id: 1,
                        slug: "test-product-1",
                        name: "Кепка \"Кепкую\" чорна",
                        price: 100,
                        image_url: "https://via.placeholder.com/200"
                    },
                    {
                        id: 2,
                        slug: "test-product-2",
                        name: "Кепка \"Кепкую\" жовта",
                        price: 200,
                        image_url: "https://via.placeholder.com/200"
                    }
                ]);
            }
        };
        const categoryMap = {
            1: "Кепки",
            2: "Футболки",
            3: "Худі"
        };
        const fetchCategoryName = async () => {
            if (category) {
                try {
                    const response = await axios.get(`/categories/${category}`);
                    console.log("Get data category:", response.data);
                    setCategoryName(response.data.name || "Category didn`t find");
                } catch (error) {
                    console.error('Error get category', error);
                    setCategoryName(categoryMap[category] || "");
                }
            } else {
                setCategoryName("");
            }
        };

        fetchProducts();
        fetchCategoryName();
    }, [category]);

    return (
        <div className="product-list-page">
            <ScrollToTopOnMount />
            <div className="category-header">
                <h2 className="text-center text-orange">{categoryName}</h2>
            </div>
            <div className="product-grid">
                {products.length > 0 ? (
                    products.map((product) => (
                        <div key={product.id} className="product-card">
                            <Link to={`/products/${product.slug}`} className="text-decoration-none">
                                <img
                                    src={product.image_url}
                                    alt={product.name}
                                    className="product-image"
                                />
                                <div className="product-info">
                                    <h5 className="product-title text-dark">{product.name}</h5>
                                    <p className="product-price text-orange">{product.price} грн</p>
                                </div>
                            </Link>
                        </div>
                    ))
                ) : (
                    <p className="text-center mt-4">Товары не найдены</p>
                )}
            </div>
        </div>
    );
}

export default ProductList;
