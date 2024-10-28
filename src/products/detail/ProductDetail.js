// src/products/detail/ProductDetail.js

import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../../axiosConfig';
import { CartContext } from '../../context/CartContext';

function ProductDetail() {
  const { id } = useParams(); // Предполагая, что в маршруте используется `:id`
  const [product, setProduct] = useState(null);
  const { addItem } = useContext(CartContext);

  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`/product/${id}`);
        setProduct(response.data);
        if (response.data.images && response.data.images.length > 0) {
          setSelectedImage(response.data.images[0]);
        }
      } catch (error) {
        console.error('Ошибка при получении продукта', error);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    const itemToAdd = {
      ...product,
      quantity,
      size: selectedSize,
    };
    addItem(itemToAdd);
  };

  if (!product) return <div>Загрузка...</div>;

  return (
      <div className="product-detail">
        <h1>{product.name}</h1>

        {/* Display selected image */}
        {selectedImage && (
            <div className="selected-image">
              <img src={selectedImage} alt={product.name} />
            </div>
        )}

        {/* Thumbnail images to select */}
        <div className="image-thumbnails">
          {product.images && product.images.map((image, index) => (
              <img
                  key={index}
                  src={image}
                  alt={`${product.name} ${index}`}
                  onClick={() => setSelectedImage(image)}
                  className={selectedImage === image ? 'active' : ''}
              />
          ))}
        </div>

        {/* Size selection */}
        {product.sizes && product.sizes.length > 0 && (
            <div className="size-selection">
              <label htmlFor="size">Розмір:</label>
              <select
                  id="size"
                  value={selectedSize}
                  onChange={(e) => setSelectedSize(e.target.value)}
              >
                <option value="">Виберіть розмір</option>
                {product.sizes.map((size) => (
                    <option key={size} value={size}>{size}</option>
                ))}
              </select>
            </div>
        )}

        {/* Quantity selection */}
        <div className="quantity-selection">
          <label htmlFor="quantity">Кількість:</label>
          <input
              id="quantity"
              type="number"
              value={quantity}
              min="1"
              onChange={(e) => setQuantity(parseInt(e.target.value))}
          />
        </div>

        {/* Add to cart button */}
        <button onClick={handleAddToCart}>Додати в кошик</button>
      </div>
  );
}

export default ProductDetail;
