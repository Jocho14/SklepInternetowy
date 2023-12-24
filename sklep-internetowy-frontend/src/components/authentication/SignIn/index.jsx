import React, { useState } from "react";
import "./styles.scss";

function SignIn() {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(login, password);
  };

  return (
    <div className="sign-in-wrapper">
      <div className="sign-in-container">
        <h1>Zaloguj się w LondonLook</h1>
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
