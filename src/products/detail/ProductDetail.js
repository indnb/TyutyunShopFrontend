import React, { useContext, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from '../../axiosConfig';
import { CartContext } from '../../context/CartContext';
import './ProductDetail.css';
import { AlertContext } from "../../template/Template";

function ProductDetail() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [images, setImages] = useState([]);
    const { cartItems, addItem } = useContext(CartContext);

    const [selectedSize, setSelectedSize] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [availableSizes, setAvailableSizes] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);
    const [recommendedProducts, setRecommendedProducts] = useState([]);

    useEffect(() => {
        const fetchProductData = async () => {
            try {
                const response = await axios.get(`/product`, { params: { product_id: id } });
                const productData = response.data[0];

                const imagesResponse = await axios.get(`/product_image_all`, { params: { product_id: id } });
                let imageData = imagesResponse.data;

                imageData.sort((a, b) => {
                    if (a.position == null) return -1;
                    if (b.position == null) return 1;
                    return a.position - b.position;
                });

                setImages(imageData.map((img) => img.image_url));
                setSelectedImage(imageData[0]?.image_url || null);

                const sizeResponse = await axios.get(`/size/${id}`);
                const sizeData = sizeResponse.data;
                const sizes = [];
                const sizesWithStock = {};

                if (sizeData.single_size > 0) {
                    sizes.push("Базовий");
                    sizesWithStock["Базовий"] = sizeData.single_size;
                } else {
                    if (sizeData.s > 0) {
                        sizes.push('S');
                        sizesWithStock['S'] = sizeData.s;
                    }
                    if (sizeData.m > 0) {
                        sizes.push('M');
                        sizesWithStock['M'] = sizeData.m;
                    }
                    if (sizeData.l > 0) {
                        sizes.push('L');
                        sizesWithStock['L'] = sizeData.l;
                    }
                    if (sizeData.xl > 0) {
                        sizes.push('XL');
                        sizesWithStock['XL'] = sizeData.xl;
                    }
                    if (sizeData.xxl > 0) {
                        sizes.push('XXL');
                        sizesWithStock['XXL'] = sizeData.xxl;
                    }
                }
                setAvailableSizes(sizes);
                setProduct({
                    ...productData,
                    sizesWithStock,
                });

                if (sizes.length === 1 && sizes[0] === "Базовий") {
                    if (sizes[0] in sizesWithStock) {
                        setSelectedSize("Базовий");
                    } else {
                        setSelectedSize('');
                    }
                }
            } catch (error) {
                console.error('Error fetching product data or images:', error);
            }
        };

        fetchProductData();
    }, [id]);

    useEffect(() => {
        const fetchRecommendedProducts = async () => {
            if (!product || !product.category_id) return;
            try {
                const response = await axios.get(`/product`, {
                    params: {
                        category_id: product.category_id,
                        selected_id: id,
                    },
                });

                const productsWithImages = await Promise.all(
                    response.data.map(async (recProduct) => {
                        const imageResponse = await axios.get(`/product_image/${recProduct.primary_image_id}`);
                        return { ...recProduct, imageUrl: imageResponse.data.image_url };
                    })
                );

                setRecommendedProducts(productsWithImages);
            } catch (error) {
                console.error('Error fetching recommended products:', error);
            }
        };

        fetchRecommendedProducts();
    }, [product, id]);

    const { showAlert } = useContext(AlertContext);

    const handleAddToCart = () => {
        if (!selectedSize || !(selectedSize in product.sizesWithStock)) {
            showAlert("Будь ласка, оберіть коректний розмір.");
            return;
        }

        const availableStock = Number(product.sizesWithStock[selectedSize]) || 0;

        if (isNaN(availableStock) || availableStock <= 0) {
            showAlert(`Розмір ${selectedSize} недоступний.`);
            return;
        }

        const cartItem = cartItems.find(
            (item) => item.id === product.id && item.size === selectedSize
        );
        const quantityInCart = cartItem ? cartItem.quantity : 0;
        const desiredQuantity = Number(quantity);

        if (isNaN(desiredQuantity) || desiredQuantity <= 0) {
            showAlert("Будь ласка, введіть коректну кількість.");
            return;
        }

        if (desiredQuantity + quantityInCart > availableStock) {
            showAlert(
                `Максимальна доступна кількість для розміру "${selectedSize}": ${
                    availableStock - quantityInCart
                }`
            );
            return;
        }

        addItem({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: desiredQuantity,
            size: selectedSize,
            stock: availableStock,
        });

        showAlert("Товар додано до кошика!");
    };

    const handleSizeChange = (e) => {
        const newSize = e.target.value;
        if (newSize in product.sizesWithStock) {
            setSelectedSize(newSize);
            setQuantity(1);
        } else {
            showAlert("Будь ласка, оберіть коректний розмір.");
            setSelectedSize('');
        }
    };

    const handleImageClick = (e) => {
        const clickPositionX = e.nativeEvent.offsetX;
        const imageWidth = e.target.clientWidth;

        if (clickPositionX < imageWidth / 2) {
            handlePreviousImage();
        } else {
            handleNextImage();
        }
    };

    const handleNextImage = () => {
        if (images.length > 1) {
            const currentIndex = images.indexOf(selectedImage);
            const nextIndex = (currentIndex + 1) % images.length;
            setSelectedImage(images[nextIndex]);
        }
    };

    const handlePreviousImage = () => {
        if (images.length > 1) {
            const currentIndex = images.indexOf(selectedImage);
            const prevIndex = (currentIndex - 1 + images.length) % images.length;
            setSelectedImage(images[prevIndex]);
        }
    };

    if (!product) return <div>Завантаження...</div>;


    return (
        <div className="product-detail-page">
            <div className="container mt-5 py-4 px-xl-5">
                <div className="row">
                    <div className="col-lg-6">
                        <div className="product-images">
                            <div
                                className="main-image text-center"
                                onClick={handleImageClick}
                            >
                                {selectedImage ? (
                                    <img
                                        src={selectedImage}
                                        alt={product.name}
                                        className="img-fluid"
                                    />
                                ) : (
                                    <p>Зображення не знайдено</p>
                                )}
                            </div>
                            <div className="image-thumbnails d-flex justify-content-center mt-3" style={{ marginBottom: 30 }}>
                                {images.map((image, index) => (
                                    <img
                                        key={index}
                                        src={image}
                                        alt={`${product.name} ${index}`}
                                        onClick={() => setSelectedImage(image)}
                                        className={`thumbnail ${selectedImage === image ? 'active' : ''}`}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-6">
                        <h3 className="product-name text-center text-orange">{product.name}</h3>
                        <p className="product-price text-center text-orange">{product.price} грн</p>
                        <div className="product-options">
                            {availableSizes.length > 1 && (
                                <div className="size-selection mb-3">
                                    <label htmlFor="size" className="form-label text-orange">Розмір:</label>
                                    <select
                                        id="size"
                                        value={selectedSize}
                                        onChange={handleSizeChange}
                                        className="form-select"
                                        style={{ color: '#FFA500' }}
                                    >
                                        <option value="" style={{ color: '#6c757d' }}>Оберіть розмір</option>
                                        {availableSizes.map((size) => (
                                            <option key={size} value={size} style={{ color: '#FFA500' }}>
                                                {size}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}
                            {selectedSize && (
                                <div className="quantity-selection mb-3">
                                    <label htmlFor="quantity" className="form-label text-orange">
                                        Кількість
                                        (макс:{" "}
                                        {selectedSize && product.sizesWithStock[selectedSize]
                                            ? product.sizesWithStock[selectedSize] -
                                            (cartItems.find(
                                                (item) => item.id === product.id && item.size === selectedSize
                                            )?.quantity || 0)
                                            : "-"}
                                        )
                                    </label>
                                    <input
                                        id="quantity"
                                        value={quantity}
                                        min="1"
                                        max={
                                            selectedSize && product.sizesWithStock[selectedSize]
                                                ? product.sizesWithStock[selectedSize] -
                                                (cartItems.find(
                                                    (item) => item.id === product.id && item.size === selectedSize
                                                )?.quantity || 0)
                                                : 1
                                        }
                                        onChange={(e) => {
                                            const value = parseInt(e.target.value);
                                            if (!isNaN(value) && value > 0) {
                                                setQuantity(value);
                                            } else {
                                                setQuantity(1);
                                            }
                                        }}
                                        className="form-control"
                                        disabled={!selectedSize}
                                    />
                                </div>
                            )}
                            <button className="btn btn-orange w-100" onClick={handleAddToCart}>Додати в кошик</button>
                        </div>
                        <div className="product-description mt-4">
                            <h5 className="text-orange">Опис товару:</h5>
                            <p>{product.description}</p>
                        </div>
                    </div>
                </div>

                {recommendedProducts.length > 0 && (
                    <div className="recommended-products mt-5">
                        <h4 className="text-center text-orange">Рекомендовані товари</h4>
                        <div className="product-grid">
                            {recommendedProducts.map((recProduct) => (
                                <div key={recProduct.id} className="product-card">
                                    <Link to={`/product/${recProduct.id}`} className="text-decoration-none">
                                        <img
                                            src={recProduct.imageUrl}
                                            alt={recProduct.name}
                                            className="product-image"
                                        />
                                        <div className="product-info">
                                            <h5 className="product-title text-orange">{recProduct.name}</h5>
                                            <p className="product-price text-orange">{recProduct.price} грн</p>
                                        </div>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ProductDetail;
