import React, { useState, useEffect } from "react";
import "./styles.scss";

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrCreateOrder() {
      console.log("fetching order");
      try {
        const response = await fetch(
          "http://localhost:3001/get-or-create-order",
          {
            method: "POST",
            credentials: "include",
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const orderData = await response.json();
        console.log("fetched orded: ", orderData);
      } catch (error) {
        console.error("Error creating or fetching order:", error);
      }
    }

    fetchOrCreateOrder();
  }, []);

  useEffect(() => {
    async function fetchCartItems() {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:3001/cart-items", {
          credentials: "include",
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log(data);
        setCartItems(data);
      } catch (error) {
        console.error("Nie udało się pobrać danych koszyka:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchCartItems();
  }, []);

  const submitOrder = async () => {
    try {
      const response = await fetch("http://localhost:3001/finalize-order", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setCartItems([]);
      return data;
    } catch (error) {
      console.error("Could not create order:", error);
    }
  };

  const total = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  if (loading) {
    return <div className="cart">Ładowanie...</div>;
  }

  return (
    <div className="cart">
      <div className="cart-items">
        <h2>Koszyk</h2>
        {cartItems.map((item) => (
          <div className="cart-item" key={item.id}>
            <div className="item-info">
              <img src={item.obrazek} alt={item.name} className="item-image" />
              <div className="item-details">
                <p className="item-name">{item.name}</p>
                <p className="item-price">{item.price} zł</p>
                <p className="item-size">Rozmiar: {item.size}</p>
                <p className="item-quantity">Ilość: {item.quantity}</p>
              </div>
            </div>
            <p className="item-subtotal">
              {(item.price * item.quantity).toFixed(2)} zł
            </p>
          </div>
        ))}
      </div>
      <div className="cart-summary">
        <h3>Podsumowanie</h3>
        <div className="summary-details">
          <p className="subtotal">Suma częściowa: {total.toFixed(2)} zł</p>
          <p className="shipping">
            Szacowany koszt wysyłki i obsługi: Bezpłatna
          </p>
          <p className="total">Suma: {total.toFixed(2)} zł</p>
          <button className="checkout-button" onClick={submitOrder}>
            Zrealizuj zamówienie
          </button>
        </div>
      </div>
    </div>
  );
}

export default Cart;
