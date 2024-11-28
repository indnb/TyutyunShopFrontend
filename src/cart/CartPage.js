import React, {useContext, useEffect, useState, useRef} from "react";
import {CartContext} from "../context/CartContext";
import {AuthContext} from "../context/AuthContext";
import axios from "../axiosConfig";
import ToggleButtons from "./ToggleButtons";
import "./CartPage.css";
import {validateField} from "../utils/validation";
import {AlertContext} from "../template/Template";

function useDebounce(value, delay) {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => setDebouncedValue(value), delay);
        return () => clearTimeout(handler);
    }, [value, delay]);

    return debouncedValue;
}

const Dropdown = React.memo(
    ({options, onSelect, placeholder, value, onSearch, isVisible, onFocus}) => {
        const containerRef = useRef(null);

        useEffect(() => {
            const handleClickOutside = (event) => {
                if (containerRef.current && !containerRef.current.contains(event.target)) {
                    onFocus(false);
                }
            };

            document.addEventListener("mousedown", handleClickOutside);
            return () => {
                document.removeEventListener("mousedown", handleClickOutside);
            };
        }, [onFocus]);

        return (
            <div ref={containerRef} className="dropdown-container mt-4">
                <input
                    type="text"
                    value={value}
                    placeholder={placeholder}
                    onChange={(e) => onSearch(e.target.value)}
                    onFocus={() => onFocus(true)}
                    required
                />
                {isVisible && options.length > 0 && (
                    <ul className="dropdown-list">
                        {options.map((option, index) => (
                            <li
                                key={index}
                                onClick={() => onSelect(option)}
                                className="dropdown-item"
                            >
                                {option.Description}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        );
    }
);

function CartPage() {
    const {isAuthenticated} = useContext(AuthContext);
    const {cartItems, addOneItem, removeOneItem, removeItem, clearCart} = useContext(CartContext);
    const [shippingData, setShippingData] = useState({
        order_id: 0,
        first_name: "",
        last_name: "",
        phone_number: "",
        email: "",
        city: "",
        branch: "",
    });
    const [cities, setCities] = useState([]);
    const [filteredBranches, setFilteredBranches] = useState([]);
    const [branches, setBranches] = useState([]);
    const [errors, setErrors] = useState({});
    const [isProcessing, setIsProcessing] = useState(false);
    const [paymentType, setPaymentType] = useState("Наложний платіж");
    const {showAlert} = useContext(AlertContext);

    const [isCityDropdownVisible, setIsCityDropdownVisible] = useState(false);
    const [isBranchDropdownVisible, setIsBranchDropdownVisible] = useState(false);

    const containerRef = useRef(null);
    const handleChange = (e) => {
        const {name, value} = e.target;
        const error = validateField(name, value);
        setErrors((prevErrors) => ({...prevErrors, [name]: error}));
    };
    const debouncedCitySearch = useDebounce(shippingData.city, 300);
    const debouncedBranchSearch = useDebounce(shippingData.branch, 300);
    useEffect(() => {
        if (isAuthenticated) {
            axios
                .get("/user/profile", {
                    headers: {Authorization: `Bearer ${localStorage.getItem("token")}`},
                })
                .then((response) => {
                    const data = response.data || {};
                    setShippingData((prev) => ({
                        ...prev,
                        id: data.id || null,
                        first_name: data.first_name || "",
                        last_name: data.last_name || "",
                        email: data.email || "",
                        phone_number: data.phone_number || "",
                        address: data.address || "",
                    }));
                })
                .catch((error) => console.error("Error fetching user profile data:", error));
        }
    }, [isAuthenticated]);

    useEffect(() => {
        if (debouncedBranchSearch.trim() === "" || branches.length === 0) {
            setFilteredBranches([]);
            setIsBranchDropdownVisible(false);
            return;
        }

        const filtered = branches.filter((branch) =>
            branch.Description.toLowerCase().includes(debouncedBranchSearch.toLowerCase())
        );
        setFilteredBranches(filtered);
    }, [debouncedBranchSearch, branches]);

    useEffect(() => {
        const handleOutsideClick = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setIsCityDropdownVisible(false);
                setIsBranchDropdownVisible(false);
            }
        };

        document.addEventListener("click", handleOutsideClick);
        return () => document.removeEventListener("click", handleOutsideClick);
    }, []);

    const handleBranchSearch = (query) => {
        if (shippingData.city.trim() === "") {
            showAlert("Спочатку оберіть місто");
            return;
        }
        setIsBranchDropdownVisible(true);
        setIsCityDropdownVisible(false);
        setShippingData((prev) => ({...prev, branch: query}));
    };

    const handleCitySearch = (query) => {
        setIsCityDropdownVisible(true);
        setShippingData((prev) => ({...prev, city: query, branch: ""}));
        if (query.trim() === "") {
            loadDefaultCities();
        }
    };

    const loadDefaultCities = () => {
        axios
            .post("https://api.novaposhta.ua/v2.0/json/", {
                apiKey: "618b7e802eba725d1094c7c56c13dddc",
                modelName: "Address",
                calledMethod: "getCities",
                methodProperties: {FindByString: ""},
            })
            .then((response) => {
                if (response.data.success) {
                    setCities(response.data.data);
                } else {
                    setCities([]);
                }
            })
            .catch((error) => console.error("Error fetching full city list:", error));
    };

    useEffect(() => {
        if (debouncedCitySearch.trim() === "") {
            loadDefaultCities();
            return;
        }

        axios
            .post("https://api.novaposhta.ua/v2.0/json/", {
                apiKey: "618b7e802eba725d1094c7c56c13dddc",
                modelName: "Address",
                calledMethod: "getCities",
                methodProperties: {FindByString: debouncedCitySearch},
            })
            .then((response) => {
                if (response.data.success) {
                    setCities(response.data.data);
                } else {
                    setCities([]);
                }
            })
            .catch((error) => console.error("Error fetching cities:", error));
    }, [debouncedCitySearch]);


    const handleCitySelect = async (city) => {
        setShippingData((prev) => ({...prev, city: city.Description, branch: ""}));
        setIsCityDropdownVisible(false);

        try {
            const response = await axios.post("https://api.novaposhta.ua/v2.0/json/", {
                apiKey: "618b7e802eba725d1094c7c56c13dddc",
                modelName: "Address",
                calledMethod: "getWarehouses",
                methodProperties: {CityRef: city.Ref},
            });

            if (response.data.success) {
                setBranches(response.data.data);
            } else {
                setBranches([]);
                setFilteredBranches([]);
            }
        } catch (error) {
            console.error("Error fetching branches:", error);
            setBranches([]);
            setFilteredBranches([]);
        }
    };

    const handleBranchSelect = (branch) => {
        setShippingData((prev) => ({...prev, branch: branch.Description}));
        setIsBranchDropdownVisible(false);
    };

    useEffect(() => {
        if (shippingData.city.trim() === "") {
            setBranches([]);
            setFilteredBranches([]);
        }
    }, [shippingData.city]);

    const handlePurchase = async (e) => {
        e.preventDefault();

        const validationErrors = {};
        Object.keys(shippingData).forEach((field) => {
            const error = validateField(field, shippingData[field]);
            if (error) validationErrors[field] = error;
        });

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            showAlert("Виправте некоректні дані!");
            return;
        }

        try {
            const cityResponse = await axios.post("https://api.novaposhta.ua/v2.0/json/", {
                apiKey: "618b7e802eba725d1094c7c56c13dddc",
                modelName: "Address",
                calledMethod: "getCities",
                methodProperties: {FindByString: shippingData.city},
            });

            const cityData = cityResponse.data.data.find(
                (city) => city.Description === shippingData.city
            );

            if (!cityData) {
                showAlert("Місто не знайдено в базі Нової Пошти.");
                return;
            }

            const branchResponse = await axios.post("https://api.novaposhta.ua/v2.0/json/", {
                apiKey: "618b7e802eba725d1094c7c56c13dddc",
                modelName: "Address",
                calledMethod: "getWarehouses",
                methodProperties: {CityRef: cityData.Ref},
            });

            const branchData = branchResponse.data.data.find(
                (branch) => branch.Description === shippingData.branch
            );

            if (!branchData) {
                showAlert("Відділення не знайдено в базі Нової Пошти.");
                return;
            }

            setIsProcessing(true);
            const token = localStorage.getItem("token");
            const orderItems = cartItems.map((item) => ({
                product_id: item.id,
                quantity: item.quantity,
                price: item.price,
                total_price: item.price * item.quantity,
                size: item.size,
            }));

            const orderData = {
                order: {
                    user_id: Number(shippingData.id),
                    total_price: totalCost,
                    status: "pending",
                    online_payment: paymentType === "Оплата картою",
                },
                order_items: orderItems,
                shipping: {
                    ...shippingData,
                    order_id: 0
                },
            };

            const response = await axios.post("/order", orderData, {
                headers: {Authorization: `Bearer ${token}`},
            });

            showAlert("Замовлення оформлено успішно!");
            clearCart();
        } catch (error) {
            console.error("Error placing new order:", error);
            showAlert("Помилка при оформленні замовлення. Спробуйте ще раз.");
        } finally {
            setIsProcessing(false);
        }
    };

    const totalCost = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

    return (
        <div className="cart-page" style={{marginTop: "56px"}}>
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
                                                    showAlert(
                                                        `Максимальна доступна кількість для розміру ${item.size}: ${item.stock}`
                                                    );
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
                                    <button
                                        className="quantity-button-del"
                                        onClick={() => removeItem(item)}
                                    >
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
                                    onChange={(e) => {
                                        handleChange(e);
                                        setShippingData({
                                            ...shippingData, first_name: e.target.value
                                        })
                                    }}
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
                                    onChange={(e) => {
                                        handleChange(e);
                                        setShippingData({...shippingData, last_name: e.target.value});
                                    }}
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
                                    onChange={(e) => {
                                        handleChange(e);
                                        setShippingData({...shippingData, email: e.target.value});
                                    }}
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
                                    onChange={(e) => {
                                        handleChange(e);
                                        setShippingData({...shippingData, phone_number: e.target.value});
                                    }}
                                    required
                                />
                                {errors.phone_number && <small className="error-text">{errors.phone_number}</small>}
                            </div>
                            <Dropdown
                                options={cities}
                                onSelect={handleCitySelect}
                                placeholder="Введіть ваше місто"
                                value={shippingData.city}
                                onSearch={handleCitySearch}
                                isVisible={isCityDropdownVisible}
                                onFocus={setIsCityDropdownVisible}
                            />
                            {shippingData.city.trim() !== "" && (
                                <Dropdown
                                    options={filteredBranches.length > 0 ? filteredBranches : branches}
                                    onSelect={handleBranchSelect}
                                    placeholder="Введіть ваше відділення"
                                    value={shippingData.branch}
                                    onSearch={handleBranchSearch}
                                    isVisible={isBranchDropdownVisible}
                                    onFocus={setIsBranchDropdownVisible}
                                />
                            )}


                            <div className="payment-method mt-4">
                                <h3>Вибір способу оплати</h3>
                                <ToggleButtons
                                    label1="Оплата картою"
                                    label2="Наложний платіж"
                                    onChange={setPaymentType}
                                />
                            </div>

                            <button className="w-100 mt-4" type="submit" disabled={isProcessing}>
                                {isProcessing ? "Обробка..." : "Підтвердити купівлю"}
                            </button>
                        </form>
                    </div>
                </>
            ) : (
                <h1 className="text-center">порожній</h1>
            )}
        </div>
    );
}

export default CartPage;
