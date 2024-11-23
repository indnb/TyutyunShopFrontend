import React, { useContext, useEffect, useState } from "react";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import axios from "../axiosConfig";
import ToggleButtons from "./ToggleButtons";
import "./CartPage.css";
import { validateField } from "../utils/validation";
import { AlertContext } from "../template/Template";

function CartPage() {
    const { isAuthenticated } = useContext(AuthContext);
    const { cartItems, addOneItem, removeOneItem, removeItem, clearCart } = useContext(CartContext);
    const [shippingData, setShippingData] = useState({
        order_id: 0,
        address: "",
        first_name: "",
        last_name: "",
        phone_number: "",
        email: "",
    });
    const [errors, setErrors] = useState({});
    const [isProcessing, setIsProcessing] = useState(false);
    const [paymentType, setPaymentType] = useState("Наложний платіж");
    const { showAlert } = useContext(AlertContext);

    const totalCost = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                if (isAuthenticated) {
                    const response = await axios.get("/user/profile", {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                    });

                    setShippingData({
                        id: response.data.id || null,
                        first_name: response.data.first_name || "",
                        last_name: response.data.last_name || "",
                        email: response.data.email || "",
                        phone_number: response.data.phone_number || "",
                        address: response.data.address || "",
                    });
                }
            } catch (error) {
                console.error("Error fetching user profile data:", error);
            }
        };
        fetchUserData();
    }, [isAuthenticated]);

    const validateFieldWrapper = (name, value) => {
        const error = validateField(name, value, shippingData);
        setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setShippingData({ ...shippingData, [name]: value });
        validateFieldWrapper(name, value);
    };

    const handlePaymentToggle = (selectedPaymentType) => {
        setPaymentType(selectedPaymentType);
    };

    const handlePurchase = async (e) => {
        e.preventDefault();

        const validationErrors = {};
        Object.keys(shippingData).forEach((field) => {
            const error = validateField(field, shippingData[field]);
            if (error) validationErrors[field] = error;
        });

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            showAlert("Будь ласка виріште помилки.");
            return;
        }

        setIsProcessing(true);
        try {
            const token = localStorage.getItem("token");
            const orderItems = cartItems.map((item) => ({
                product_id: item.id,
                quantity: item.quantity,
                price: item.price,
                total_price: item.price * item.quantity,
                size: item.size,
            }));

            const online_payment = paymentType === "Оплата картою";
            if (online_payment) {
                showAlert("Оплата наразі тільки при отриманні :(");
                setIsProcessing(false);
                return;
            }

            const orderData = {
                order: {
                    user_id: Number(shippingData.id),
                    total_price: totalCost,
                    status: "pending",
                    online_payment,
                },
                order_items: orderItems,
            };

            const response = await axios.post("/order", orderData, {
                headers: { Authorization: `Bearer ${token}` },
            });

            shippingData.order_id = response.data;

            await axios.post(`/shipping`, shippingData, {
                headers: { Authorization: `Bearer ${token}` },
            });

            await axios.post(
                `/mail/new_order`,
                null,
                {
                    params: {
                        id: response.data,
                    },
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            showAlert("Замовлення оформлено успішно!");
            clearCart();
        } catch (error) {
            console.error("Error placing new order:", error);
            showAlert("Помилка при оформленні замовлення. Спробуйте ще раз.");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="cart-page" style={{ marginTop: "56px" }}>
            <h1 className="text-center">Кошик</h1>
            {cartItems.length > 0 && (
                <button className="clear-cart-button" onClick={clearCart}>
                    Очистити кошик
                </button>
            )}
            {cartItems.length > 0 ? (
                <>
                    <table className="cart-table">
                        <thead>
                        <tr>
                            <th>Назва</th>
                            <th>Розмір</th>
                            <th>Кількість</th>
                            <th>Ціна за одиницю</th>
                            <th>Дії</th>
                        </tr>
                        </thead>
                        <tbody>
                        {cartItems.map((item) => (
                            <tr key={`${item.id}-${item.size}-${item.name}`}>
                                <td>{item.name}</td>
                                <td>{item.size}</td>
                                <td>
                                    <div className="quantity-controls">
                                        <button
                                            className="quantity-button"
                                            onClick={() => removeOneItem(item)}
                                            disabled={item.quantity <= 1}
                                        >
                                            -
                                        </button>
                                        <span className="quantity">{item.quantity}</span>
                                        <button
                                            className="quantity-button"
                                            onClick={() => {
                                                if (item.quantity < item.stock) {
                                                    addOneItem(item);
                                                } else {
                                                    showAlert(`Максимальна доступна кількість для розміру ${item.size}: ${item.stock}`);
                                                }
                                            }}
                                            disabled={item.quantity >= item.stock}
                                        >
                                            +
                                        </button>
                                    </div>
                                    <div className="stock-info">
                                        <small>В наявності: {item.stock - item.quantity}</small>
                                    </div>
                                </td>
                                <td>{item.price} грн</td>
                                <td>
                                    <button className="quantity-button-del" onClick={() => removeItem(item)}>
                                        Видалити
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    <h3>Загальна вартість: {totalCost} грн</h3>

                    <div className="purchase-block">
                        <h2>Дані для відправки</h2>
                        <form onSubmit={handlePurchase}>
                            <div>
                                <label>Ім'я</label>
                                <input
                                    type="text"
                                    name="first_name"
                                    value={shippingData.first_name}
                                    placeholder="Введіть ваше ім'я"
                                    onChange={handleInputChange}
                                    required
                                />
                                {errors.first_name && <small className="error-text">{errors.first_name}</small>}
                            </div>
                            <div>
                                <label>Прізвище</label>
                                <input
                                    type="text"
                                    name="last_name"
                                    value={shippingData.last_name}
                                    placeholder="Введіть ваше прізвище"
                                    onChange={handleInputChange}
                                    required
                                />
                                {errors.last_name && <small className="error-text">{errors.last_name}</small>}
                            </div>
                            <div>
                                <label>Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={shippingData.email}
                                    placeholder="example@gmail.com"
                                    onChange={handleInputChange}
                                    required
                                />
                                {errors.email && <small className="error-text">{errors.email}</small>}
                            </div>
                            <div>
                                <label>Телефон</label>
                                <input
                                    type="tel"
                                    name="phone_number"
                                    value={shippingData.phone_number}
                                    placeholder="+380XXXXXXXXX"
                                    onChange={handleInputChange}
                                    required
                                />
                                {errors.phone_number && <small className="error-text">{errors.phone_number}</small>}
                            </div>
                            <div>
                                <label>Адреса доставки</label>
                                <input
                                    type="text"
                                    name="address"
                                    value={shippingData.address}
                                    placeholder="Введіть адресу доставки"
                                    onChange={handleInputChange}
                                    required
                                />
                                {errors.address && <small className="error-text">{errors.address}</small>}
                            </div>

                            <div className="payment-method mt-4">
                                <h3>Вибір способу оплати</h3>
                                <div>
                                    <ToggleButtons
                                        label1="Оплата картою"
                                        label2="Наложний платіж"
                                        onChange={handlePaymentToggle}
                                    />
                                </div>
                            </div>

                            <button className="w-100 mt-4" type="submit" disabled={isProcessing}>
                                {isProcessing ? "Обробка..." : "Підтвердити купівлю"}
                            </button>
                        </form>
                    </div>
                </>
            ) : (
                <h1 className="text-center">Порожній</h1>
            )}
        </div>
    );
}

export default CartPage;
