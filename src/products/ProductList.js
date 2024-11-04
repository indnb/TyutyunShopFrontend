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

                const productsWithImages = await Promise.all(
                    response.data.map(async (product) => {
                        const imageResponse = await axios.get(`/product_image/${product.primary_image_id}`);
                        return { ...product, imageUrl: imageResponse.data.image_url };
                    })
                );

                console.log("Get product:", productsWithImages);
                setProducts(productsWithImages);
            } catch (error) {
                console.error('Error getting product', error);
            }
        };

        const fetchCategoryName = async () => {
            if (category) {
                try {
                    const response = await axios.get(`/category/${category}`);
                    console.log("Get data category:", category);
                    setCategoryName(response.data.name || "Category didn’t find");
                } catch (error) {
                    console.error('Error getting category', error);
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
            <ScrollToTopOnMount/>
            <div className="category-header">
                <h2 className="text-center text-orange">{categoryName}</h2>
            </div>
            <div className="product-grid">
                {products.length > 0 ? (
                    products.map((product) => (
                        <div key={product.id} className="product-card">
                            <Link to={`/products/${product.slug}`} className="text-decoration-none">
                                <img
                                    src={product.imageUrl}
                                    alt={product.name}
                                    className="product-image"
                                />
                                <div className="product-info">
                                    <h5 className="product-title text-white">{product.name}</h5>
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
