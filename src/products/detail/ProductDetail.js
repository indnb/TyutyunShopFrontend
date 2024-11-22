import React, {useContext, useEffect, useState} from 'react';
import {Link, useParams} from 'react-router-dom';
import axios from '../../axiosConfig';
import {CartContext} from '../../context/CartContext';
import './ProductDetail.css';
import {AlertContext} from "../../template/Template";

function ProductDetail() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [images, setImages] = useState([]);
    const { addItem } = useContext(CartContext);

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
                setProduct(productData);

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
                if (sizeData.single_size <= 0) {
                    if (sizeData.s > 0) sizes.push('S');
                    if (sizeData.m > 0) sizes.push('M');
                    if (sizeData.l > 0) sizes.push('L');
                    if (sizeData.xl > 0) sizes.push('XL');
                    if (sizeData.xxl > 0) sizes.push('XXL');
                } else {
                    sizes.push("single_size");
                    setSelectedSize("Базовий розмір");
                }
                setAvailableSizes(sizes);
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
        if (!selectedSize) {
            showAlert("Будь ласка, оберіть розмір.");
            return;
        }
        addItem({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: Number(quantity),
            size: selectedSize,
        });
    };

    const handleSizeChange = (e) => {
        setSelectedSize(e.target.value);
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
                            <div className="image-thumbnails d-flex justify-content-center mt-3" style={{marginBottom: 30}}>
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
                            {availableSizes.length > 0 && availableSizes[0] !== "single_size" && (
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
                            <div className="quantity-selection mb-3">
                                <label htmlFor="quantity" className="form-label text-orange">Кількість:</label>
                                <input
                                    id="quantity"
                                    value={quantity}
                                    min="1"
                                    onChange={(e) => setQuantity(parseInt(e.target.value))}
                                    className="form-control"
                                />
                            </div>
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
