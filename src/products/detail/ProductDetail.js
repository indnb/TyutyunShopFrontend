import React, {useState, useEffect, useContext} from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from '../../axiosConfig';
import { CartContext } from '../../context/CartContext';
import './ProductDetail.css';

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [images, setImages] = useState([]);
  const { addItem } = useContext(CartContext);

  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [availableSizes, setAvailableSizes] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  const [recommendedProducts, setRecommendedProducts] = useState([
    {
      id: 1,
      name: "Recommended Product 1",
      slug: "recommended-product-1",
      image_url: "https://via.placeholder.com/200",
      price: 100,
    },
    {
      id: 2,
      name: "Recommended Product 2",
      slug: "recommended-product-2",
      image_url: "https://via.placeholder.com/200",
      price: 150,
    },
    {
      id: 3,
      name: "Recommended Product 3",
      slug: "recommended-product-3",
      image_url: "https://via.placeholder.com/200",
      price: 200,
    },
  ]);

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const response = await axios.get(`/product/${id}`);
        const productData = response.data;
        setProduct(productData);

        const imagesResponse = await axios.get(`/product_image_all/${id}`);
        const imageUrls = imagesResponse.data.map((url) => `${url}`);
        setImages(imageUrls);
        setSelectedImage(imageUrls[0] || null);

        const sizeResponse = await axios.get(`/size/${id}`);
        const sizeData = sizeResponse.data;
        const sizes = [];
        if (sizeData.single_size <= 0)
        {
          if (sizeData.s > 0) sizes.push('S');
          if (sizeData.m > 0) sizes.push('M');
          if (sizeData.l > 0) sizes.push('L');
          if (sizeData.xl > 0) sizes.push('XL');
          if (sizeData.xxl > 0) sizes.push('XXL');
        }
        else
        {
          sizes.push("single_size");
          setSelectedSize("Базовий розмір")
        }
        setAvailableSizes(sizes);
      } catch (error) {
        console.error('Error fetching product data or images:', error);
      }
    };

    fetchProductData();
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

  const handleSizeChange = (e) => {
    setSelectedSize(e.target.value);

  };
  if (!product) return <div>Завантаження...</div>;

  return (
      <div className="product-detail-page">
        <div className="container mt-5 py-4 px-xl-5">
          <div className="row">
            <div className="col-lg-6">
              <div className="product-images">
                <div className="main-image text-center">
                  {selectedImage ? (
                      <img src={selectedImage} alt={product.name} className="img-fluid" />
                  ) : (
                      <p>Зображення не знайдено</p>
                  )}
                </div>
                <div className="image-thumbnails d-flex justify-content-center mt-3">
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
              <h1 className="product-name text-center text-orange">{product.name}</h1>
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
                          style={{color: '#FFA500'}}
                      >
                        <option value="" style={{color: '#6c757d'}}>Оберіть розмір</option>
                        {availableSizes.map((size) => (
                            <option key={size} value={size} style={{color: '#FFA500'}}>
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
              <div className="product-comments mt-5">
                <h4 className="text-center text-orange">Коментарі</h4>
                <p className="text-center">Коментарі до цього товару поки відсутні.</p>
              </div>
            </div>
          </div>

          {recommendedProducts && recommendedProducts.length > 0 && (
              <div className="recommended-products mt-5">
                <h4 className="text-center text-orange">Рекомендовані товари</h4>
                <div className="row">
                  {recommendedProducts.map((recProduct) => (
                      <div key={recProduct.id} className="col-md-4 col-lg-3 mb-4 d-flex justify-content-center">
                        <div className="card h-100 border-0 shadow-sm">
                          <Link to={`/products/${recProduct.slug}`} className="text-decoration-none">
                            <img
                                src={recProduct.image_url}
                                alt={recProduct.name}
                                className="card-img-top"
                                style={{ objectFit: "cover", height: "200px", width: "100%" }}
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
        </div>
      </div>
  );
}

export default ProductDetail;
