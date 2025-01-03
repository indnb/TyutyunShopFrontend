import React, {useContext, useEffect, useState} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {Link, useHistory} from 'react-router-dom';
import {CartContext} from '../context/CartContext';
import {AuthContext} from '../context/AuthContext';
import axios from '../axiosConfig';
import './Header.css';

function Header() {
  const { cartItems } = useContext(CartContext);
  const { isAuthenticated, isAdmin, logout } = useContext(AuthContext);
  const [openedDrawer, setOpenedDrawer] = useState(false);
  const [categories, setCategories] = useState([]);
  const history = useHistory();

  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('/categories');
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
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
    logout();
    history.push('/login');
  };

  return (
      <header>
        <nav className="navbar fixed-top navbar-expand-lg navbar-dark bg-dark border-bottom-orange">
          <div className="container-fluid">
            <Link className="navbar-brand text-orange" to="/" onClick={changeNav}>
              <span className="ms-2 h5">vlados.shop</span>
            </Link>

            <div className={'navbar-collapse offcanvas-collapse ' + (openedDrawer ? 'open' : '')}>
              <div className="d-flex justify-content-center w-100" style={{marginBottom: 5, fontSize: '20px'}}>
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
              <Link to="/cart" className="btn btn-outline-orange me-3" type="button" onClick={changeNav}>
                <FontAwesomeIcon icon={['fas', 'shopping-cart']} />
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
                    <FontAwesomeIcon icon={['fas', 'user-alt']} />
                  </a>
                  <ul className="mt-2 dropdown-menu dropdown-menu-end bg-dark border-orange" aria-labelledby="userDropdown">
                    {isAuthenticated ? (
                        <>
                          <li>
                            <Link to="/user/profile" className="btn dropdown-item text-orange" onClick={changeNav}>
                              Профіль
                            </Link>
                          </li>
                          {isAdmin && (
                              <li>
                                <Link to="/admin" className="btn dropdown-item text-orange" onClick={changeNav}>
                                  ТЮТЮН ПАНЕЛЬ
                                </Link>
                              </li>
                          )}
                          <li>
                            <button className="btn dropdown-item text-orange" onClick={handleLogout}>
                              Вийти
                            </button>
                          </li>
                        </>
                    ) : (
                        <>
                          <li>
                            <Link to="/login" className="btn dropdown-item text-orange" onClick={changeNav}>
                              Вхід
                            </Link>
                          </li>
                          <li>
                            <Link to="/register" className="btn dropdown-item text-orange" onClick={changeNav}>
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
