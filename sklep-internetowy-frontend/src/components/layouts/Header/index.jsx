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
          <NavLink to="/products">Products</NavLink>
          <NavLink to="/about">About</NavLink>
          <NavLink to="/contact">Contact</NavLink>
        </nav>
      </div>
    </header>
  );
}

export default Header;
