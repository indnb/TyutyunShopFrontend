import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { CartContext } from '../../context/CartContext';
import './ProductDetail.css';

function ProductDetail() {
  const { slug } = useParams();
  const { addItem } = useContext(CartContext);
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('');

  useEffect(() => {
    const data = {
      id: 1,
      name: 'Футболка Tyutyun',
      price: 500,
      images: ['https://via.placeholder.com/400x400?text=Футболка+Tyutyun', 'https://via.placeholder.com/400x400?text=Інше+Фото'],
      description: 'Опис товару...',
      sizes: ['S', 'M', 'L', 'XL'],
    };
    setProduct(data);
    setSelectedImage(data.images[0]);
    setSelectedSize(data.sizes[0]);
  }, [slug]);


  const addToCart = () => {
    if (!selectedSize) {
      alert('Будь ласка, оберіть розмір');
      return;
    }

    addItem({
      ...product,
      quantity: parseInt(quantity),
      size: selectedSize
    });
  };

  if (!product) return <div>Завантаження...</div>;

  return (
      <div className="product-detail container mt-5 py-4 px-xl-5">
        <h1 className="text-orange text-center">{product.name}</h1>
        <div className="product-content row justify-content-center">
          <div className="col-md-6 text-center">
            <img src={selectedImage} alt={product.name} className="main-image" />
            <div className="thumbnail-images d-flex justify-content-center mt-3">
              {product.images.map((image) => (
                  <img
                      key={image}
                      src={image}
                      alt={product.name}
                      className="thumbnail"
                      onClick={() => setSelectedImage(image)}
                  />
              ))}
            </div>
          </div>
          <div className="col-md-6 product-info">
            <p className="text-orange">Ціна: {product.price} грн</p>
            <div className="mb-3">
              <label>Розмір:</label>
              <select
                  className="form-select mt-1"
                  value={selectedSize}
                  onChange={(e) => setSelectedSize(e.target.value)}
              >
                {product.sizes.map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <label>Кількість:</label>
              <input
                  type="number"
                  value={quantity}
                  min="1"
                  onChange={(e) => setQuantity(e.target.value)}
                  className="form-control mt-1"
              />
            </div>
            <button onClick={addToCart} className="btn btn-orange mt-3">
              Додати в кошик
            </button>
            <p className="mt-4">{product.description}</p>
          </div>
        </div>
      </div>
  );
}

export default ProductDetail;
