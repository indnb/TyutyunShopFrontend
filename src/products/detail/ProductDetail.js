import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from '../../axiosConfig';
import { CartContext } from '../../context/CartContext';
import './ProductDetail.css';

function ProductDetail() {
  const { id } = useParams();
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
        console.error('Error get product', error);
        const testProduct = {
          id: id,
          name: "Тестовий товар",
          images: [
            "https://via.placeholder.com/400x500.png?text=Product+Image+1",
            "https://via.placeholder.com/400x500.png?text=Product+Image+2",
            "https://via.placeholder.com/400x500.png?text=Product+Image+3"
          ],
          sizes: ["S", "M", "L", "XL"],
          price: 300,
          description: "Це опис тестового товару.",
          recommendedProducts: [
            {
              id: 2,
              slug: "test-product-2",
              name: "Рекомендований товар 1",
              price: 250,
              image_url: "https://via.placeholder.com/200x250.png?text=Recommended+1"
            },
            {
              id: 3,
              slug: "test-product-3",
              name: "Рекомендований товар 2",
              price: 350,
              image_url: "https://via.placeholder.com/200x250.png?text=Recommended+2"
            }
          ]
        };
        setProduct(testProduct);
        setSelectedImage(testProduct.images[0]);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert("Будь ласка, оберіть розмір.");
      return;
    }

    const itemToAdd = {
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: Number(quantity),
      size: selectedSize,
    };
    addItem(itemToAdd);
  };

  if (!product) return <div>Завантаження...</div>;

  return (<div className="product-detail-page">
        <div className="container mt-5 py-4 px-xl-5">
          <div className="row">
            <div className="col-lg-6">
              <div className="product-images">
                <div className="main-image text-center">
                  <img src={selectedImage} alt={product.name} className="img-fluid"/>
                </div>
                <div className="image-thumbnails d-flex justify-content-center mt-3">
                  {product.images && product.images.map((image, index) => (
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
              <h1 className="product-name text-center text-orange">{product.name}</h1>
              <p className="product-price text-center text-orange">{product.price} грн</p>
              <div className="product-options">
                {product.sizes && product.sizes.length > 0 && (
                    <div className="size-selection mb-3">
                      <label htmlFor="size" className="form-label text-orange">Розмір:</label>
                      <select
                          id="size"
                          value={selectedSize}
                          onChange={(e) => setSelectedSize(e.target.value)}
                          className="form-select"
                      >
                        <option value="">Оберіть розмір</option>
                        {product.sizes.map((size) => (
                            <option key={size} value={size}>{size}</option>
                        ))}
                      </select>
                    </div>
                )}
                <div className="quantity-selection mb-3">
                  <label htmlFor="quantity" className="form-label text-orange">Кількість:</label>
                  <input
                      id="quantity"
                      type="number"
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
          {product.recommendedProducts && product.recommendedProducts.length > 0 && (
              <div className="recommended-products mt-5">
                <h4 className="text-center text-orange">Рекомендовані товари</h4>
                <div className="row">
                  {product.recommendedProducts.map((recProduct) => (
                      <div key={recProduct.id} className="col-md-4 col-lg-3 mb-4 d-flex justify-content-center">
                        <div className="card h-100 border-0 shadow-sm">
                          <Link to={`/products/${recProduct.slug}`} className="text-decoration-none">
                            <img
                                src={recProduct.image_url}
                                alt={recProduct.name}
                                className="card-img-top"
                                style={{objectFit: "cover", height: "200px", width: "100%"}}
                            />
                            <div className="card-body text-center">
                              <h5 className="card-title text-dark">{recProduct.name}</h5>
                              <p className="card-text text-orange">{recProduct.price} грн</p>
                            </div>
                          </Link>
                        </div>
                      </div>
                  ))}
                </div>
              </div>
          )}
          <div className="product-comments mt-5">
            <h4 className="text-center text-orange">Коментарі</h4>
            <p className="text-center">Коментарі до цього товару поки відсутні.</p>
          </div>
        </div>
      </div>
  );
}

export default ProductDetail;
