import React, { useState } from "react";
import "./styles.scss";

function SignUp() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      alert("Hasła nie są identyczne.");
      return;
    }
    console.log(firstName, lastName, email, login, password, phoneNumber);
    // Tutaj logika do obsługi rejestracji
  };

  return (
    <div className="sign-up-wrapper">
      <div className="sign-up-container">
        <h1>Zarejestruj się w LondonLook</h1>
        <form className="sign-up-form">
          <div className="input-wrapper">
            <label htmlFor="name">Imię</label>
            <input
              id="name"
              type="text"
              placeholder="Imię"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>
          <div className="input-wrapper">
            <label htmlFor="surname">Nazwisko</label>
            <input
              id="surname"
              type="text"
              placeholder="Nazwisko"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>
          <div className="input-wrapper">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="Adres email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-wrapper">
            <label htmlFor="login">Login</label>
            <input
              id="login"
              type="text"
              placeholder="Login"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              required
            />
          </div>
          <div className="input-wrapper">
            <label htmlFor="password">Hasło</label>
            <input
              id="password"
              type="password"
              placeholder="Hasło"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="input-wrapper">
            <label htmlFor="password-2nd">Potwierdź hasło</label>
            <input
              id="password-2nd"
              type="password"
              placeholder="Potwierdź hasło"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <div className="input-wrapper">
            <label htmlFor="phone-number">Numer telefonu</label>
            <input
              id="phone-number"
              type="text"
              placeholder="Numer telefonu"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
            />
          </div>
          <button type="submit">Zarejestruj</button>
        </form>
      </div>
    </div>
  );
}

export default SignUp;
