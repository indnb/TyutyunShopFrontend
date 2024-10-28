// ProductList.js

import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import ScrollToTopOnMount from "../template/ScrollToTopOnMount";

function ProductList() {
    const { category } = useParams();

    const categoryNames = {
        caps: "Кепки",
        hoodie: "Худі",
        "t-shirts": "Футболки",
    };

    const categoryDisplayName = categoryNames[category] || "Усі товари";

    const products = [
        {
            id: 1,
            name: "Футболка Tyutyun",
            price: 500,
            image: "https://via.placeholder.com/200x200?text=Футболка+Tyutyun",
            slug: "tyutyun-tshirt",
        },
        {
            id: 2,
            name: "Кепка Tyutyun",
            price: 300,
            image: "https://via.placeholder.com/200x200?text=Кепка+Tyutyun",
            slug: "tyutyun-cap",
        },
        {
            id: 3,
            name: "Худі Tyutyun",
            price: 800,
            image: "https://via.placeholder.com/200x200?text=Худі+Tyutyun",
            slug: "tyutyun-hoodie",
        },
        {
            id: 4,
            name: "Худі Tyutyun",
            price: 800,
            image: "https://via.placeholder.com/200x200?text=Худі+Tyutyun",
            slug: "tyutyun-hoodie",
        },
        {
            id: 5,
            name: "Худі Tyutyun",
            price: 800,
            image: "https://via.placeholder.com/200x200?text=Худі+Tyutyun",
            slug: "tyutyun-hoodie",
        },
        {
            id: 6,
            name: "Худі Tyutyun",
            price: 800,
            image: "https://via.placeholder.com/200x200?text=Худі+Tyutyun",
            slug: "tyutyun-hoodie",
        }
    ];

    return (
        <div className="container mt-5 py-4 px-xl-5">
            <ScrollToTopOnMount />
            <div className="row mb-4 mt-lg-3">
                <div className="col-12">
                    <h2 className="text-center text-orange">{categoryDisplayName}</h2>
                    <div className="row justify-content-center">
                        {products.map((product) => (
                            <div key={product.id} className="col-md-4 col-lg-3 mb-4 d-flex justify-content-center">
                                <div className="card h-100 border-0 shadow-sm">
                                    <Link to={`/products/${product.slug}`} className="text-decoration-none">
                                        <img
                                            src={product.image}
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
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductList;
