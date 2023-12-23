import React from "react";
import "./styles.scss";
import { Link, NavLink, Outlet } from "react-router-dom";

function Header() {
  return (
    <header className="header">
      <NavLink to="/">
        <div className="header__logo"></div>
      </NavLink>
      <div className="header_navbar">
        <nav className="header__navbar__list">
          <NavLink to="/products">Produkty</NavLink>
          <NavLink to="/about">O nas</NavLink>
          <NavLink to="/contact">Kontakt</NavLink>
        </nav>
      </div>
    </header>
  );
}

export default Header;
