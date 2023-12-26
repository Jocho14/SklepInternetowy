import React, { useState } from "react";
import { useUser } from "../../../context";
import { USER_TYPES } from "../../../context/UserTypes";
import errorAlertIcon from "../../../assets/images/authentication/errorAlertIcon.png";
import "./styles.scss";

function SignIn() {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState(false);

  const { loginUser } = useUser();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoginError(false);
    try {
      const response = await fetch("http://localhost:3001/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ login, password }),
      });

      console.log(JSON.stringify({ login, password }));

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        console.log("Zalogowano pomyślnie:", data);
        loginUser(
          data.idUzytkownika,
          data.typUzytkownika === "CLIENT"
            ? USER_TYPES.CLIENT
            : USER_TYPES.EMPLOYEE
        );
        console.log("Zalogowano jako:", data.typUzytkownika);
      } else {
        console.error("Błąd logowania:", data.message);
        setLoginError(true);
      }
    } catch (error) {
      console.error("Wystąpił błąd podczas logowania:", error);
      setLoginError(true);
    }
  };

  return (
    <div className="sign-in-wrapper">
      <div className="sign-in-container">
        <h1>Zaloguj się w LondonLook</h1>
        {loginError && (
          <div className="login-error">
            <img className="login-error__icon" src={errorAlertIcon} />
            Wprowadzono nieprawidłowe dane
          </div>
        )}
        <form className="sign-in-form" onSubmit={handleSubmit}>
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
          <button type="submit">Zaloguj</button>
        </form>
      </div>
    </div>
  );
}

export default SignIn;
