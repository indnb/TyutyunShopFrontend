import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from '../axiosConfig';
import ScrollToTopOnMount from "../template/ScrollToTopOnMount";

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
            }
        };

        const fetchCategoryName = async () => {
            if (category) {
                try {
                    const response = await axios.get(`/categories/${category}`);
                    console.log("Get data category:", response.data);
                    setCategoryName(response.data.name || "Category didn`t find");
                } catch (error) {
                    console.error('Error get category', error);
                    setCategoryName("Error load category");
                }
            } else {
                setCategoryName("");
            }
        };

        fetchProducts();
        fetchCategoryName();
    }, [category]);

    return (
        <div className="container mt-5 py-4 px-xl-5">
            <ScrollToTopOnMount />
            <div className="row mb-4 mt-lg-3">
                <div className="col-12">
                    <h2 className="text-center text-orange">{categoryName}</h2>
                    <div className="row justify-content-center">
                        {products.length > 0 ? (
                            products.map((product) => (
                                <div key={product.id} className="col-md-4 col-lg-3 mb-4 d-flex justify-content-center">
                                    <div className="card h-100 border-0 shadow-sm">
                                        <Link to={`/products/${product.slug}`} className="text-decoration-none">
                                            <img
                                                src={product.image_url}
                                                alt={product.name}
                                                className="card-img-top"
                                                style={{ objectFit: "cover", height: "200px", width: "200px" }}
                                            />
                                            <div className="card-body text-center">
                                                <h5 className="card-title text-dark">{product.name}</h5>
                                                <p className="card-text text-orange">{product.price} грн</p>
                                            </div>
                                        </Link>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-center mt-4">Товары не найдены</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductList;
