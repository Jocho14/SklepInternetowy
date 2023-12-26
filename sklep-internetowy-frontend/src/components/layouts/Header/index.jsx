import React from "react";
import { NavLink } from "react-router-dom";
import { useUser } from "../../../context";
import { USER_TYPES } from "../../../context/UserTypes";
import "./styles.scss";

function Header() {
  const { user } = useUser();
  console.log("header user: ", user);
  return (
    <header className="header">
      <div className="signin-signup-wrapper">
        <div className="signin-signup-container">
          {user.type === USER_TYPES.CLIENT ? (
            <span>Cześć, Arturito!</span> // Załóżmy, że `imie` to właściwość w `user.details`
          ) : (
            <>
              <NavLink to="/signup" className="signup-link">
                Zarejestruj Się
              </NavLink>
              <span className="separator-link"> | </span>
              <NavLink to="/signin" className="signin-link">
                Zaloguj się
              </NavLink>
            </>
          )}
        </div>
      </div>
      <div className="content">
        <NavLink to="/">
          <div className="header__logo"></div>
        </NavLink>
        <div className="header__navbar">
          <nav className="header__navbar__list">
            <NavLink to="/products">Produkty</NavLink>
            <NavLink to="/about">O nas</NavLink>
            <NavLink to="/contact">Kontakt</NavLink>
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Header;
