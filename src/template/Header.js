import React, { useState, useEffect, useContext } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, useHistory } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import axios from "../axiosConfig";
import './Header.css';

function Header() {
  const { cartItems } = useContext(CartContext);
  const [openedDrawer, setOpenedDrawer] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [categories, setCategories] = useState([]);
  const history = useHistory();

  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    const fetchUserRole = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        setIsAuthenticated(true);
        try {
          const response = await axios.get('/user/role', {
            headers: { Authorization: `Bearer ${token}` }
          });
          setIsAdmin(response.data.role === 'ADMIN');
        } catch (error) {
          console.error("Error get user`s role:", error);
          //setIsAdmin(true);
          //setIsAuthenticated(true);
        }
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await axios.get('/categories');
        setCategories(response.data);
      } catch (error) {
        console.error("Error get category:", error);
        setCategories([
          { id: 1, name: "Кепки" },
          { id: 2, name: "Футболки" },
          { id: 3, name: "Худі" }
        ]);
      }
    };

    fetchUserRole();
    fetchCategories();
  }, []);

  const toggleDrawer = () => {
    setOpenedDrawer(!openedDrawer);
  };

  const changeNav = () => {
    if (openedDrawer) {
      setOpenedDrawer(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setIsAdmin(false);
    history.push('/login');
  };

  return (
      <header>
        <nav className="navbar fixed-top navbar-expand-lg navbar-dark bg-dark border-bottom-orange">
          <div className="container-fluid">
            <Link className="navbar-brand text-orange" to="/" onClick={changeNav}>
              <span className="ms-2 h5">Tyutyun.shop</span>
            </Link>

            <div className={"navbar-collapse offcanvas-collapse " + (openedDrawer ? 'open' : '')}>
              <div className="d-flex justify-content-center w-100">
                {categories.map((category) => (
                    <Link
                        key={category.id}
                        to={`/products/category/${category.id}`}
                        className="nav-link text-center text-orange mx-3"
                        onClick={changeNav}
                    >
                      {category.name}
                    </Link>
                ))}
              </div>

              <Link to="/cart" className="btn btn-outline-orange me-3 d-none d-lg-inline" style={{width: 100}}>
                <FontAwesomeIcon icon={["fas", "shopping-cart"]}/>
                <span className="ms-3 badge rounded-pill bg-orange">{totalItems}</span>
              </Link>

              <ul className="navbar-nav mb-2 mb-lg-0">
                <li className="nav-item dropdown">
                  <a
                      className="nav-link dropdown-toggle text-orange"
                      data-toggle="dropdown"
                      id="userDropdown"
                      role="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                  >
                    <FontAwesomeIcon icon={["fas", "user-alt"]}/>
                  </a>
                  <ul className="dropdown-menu dropdown-menu-end bg-dark border-orange" aria-labelledby="userDropdown">
                    {isAuthenticated ? (
                        <>
                          <li>
                            <Link to="/user/profile" className="dropdown-item text-orange" onClick={changeNav}>
                              Профіль
                            </Link>
                          </li>
                          {isAdmin && (
                              <li>
                                <Link to="/admin" className="dropdown-item text-orange" onClick={changeNav}>
                                  Адмін-панель
                                </Link>
                              </li>
                          )}
                          <li>
                            <button className="dropdown-item text-orange" onClick={handleLogout}>
                              Вийти
                            </button>
                          </li>
                        </>
                    ) : (
                        <>
                          <li>
                            <Link to="/login" className="dropdown-item text-orange" onClick={changeNav}>
                              Вхід
                            </Link>
                          </li>
                          <li>
                            <Link to="/register" className="dropdown-item text-orange" onClick={changeNav}>
                              Реєстрація
                            </Link>
                          </li>
                        </>
                    )}
                  </ul>
                </li>
              </ul>
            </div>

            <div className="d-inline-block d-lg-none">
              <button type="button" className="btn btn-outline-orange">
                <FontAwesomeIcon icon={["fas", "shopping-cart"]}/>
                <span className="ms-3 badge rounded-pill bg-orange">{totalItems}</span>
              </button>
              <button className="navbar-toggler p-0 border-0 ms-3" type="button" onClick={toggleDrawer}>
                <span className="navbar-toggler-icon"></span>
              </button>
            </div>
          </div>
        </nav>
      </header>
  );
}

export default Header;
