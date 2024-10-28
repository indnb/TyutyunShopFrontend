import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";
import './Header.css';

function Header() {
  const { cartItems } = useContext(CartContext);
  const [openedDrawer, setOpenedDrawer] = useState(false);

  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  function toggleDrawer() {
    setOpenedDrawer(!openedDrawer);
  }

  function changeNav() {
    if (openedDrawer) {
      setOpenedDrawer(false);
    }
  }

  return (
      <header>
        <nav className="navbar fixed-top navbar-expand-lg navbar-dark bg-dark border-bottom-orange">
          <div className="container-fluid">
            <Link className="navbar-brand text-orange" to="/" onClick={changeNav}>
              <span className="ms-2 h5">Tyutyun.shop</span>
            </Link>

            <div className={"navbar-collapse offcanvas-collapse " + (openedDrawer ? 'open' : '')}>
              <div className="d-flex justify-content-center w-100">
                <Link to="/products/category/caps" className="nav-link text-center text-orange mx-3">
                  Кепки
                </Link>
                <Link to="/products/category/hoodie" className="nav-link text-center text-orange mx-3">
                  Худі
                </Link>
                <Link to="/products/category/t-shirts" className="nav-link text-center text-orange mx-3">
                  Футболки
                </Link>
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
                  <ul className="dropdown-menu dropdown-menu-end bg-dark border-orange" aria-labelledby="user-dropdown">
                    <li>
                      <Link to="/login" className="dropdown-item text-orange" onClick={changeNav}>
                        Login
                      </Link>
                    </li>
                    <li>
                      <Link to="/register" className="dropdown-item text-orange" onClick={changeNav}>
                        Sign Up
                      </Link>
                    </li>
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
