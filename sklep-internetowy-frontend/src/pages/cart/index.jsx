import React, { useState, useEffect } from "react";
import "./styles.scss";

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [completedOrders, setCompletedOrders] = useState([]);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [expandedOrders, setExpandedOrders] = useState({});
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

  const fetchCartItems = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:3001/cart-items", {
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setCartItems(data);
    } catch (error) {
      console.error("Nie udało się pobrać danych koszyka:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, []);

  useEffect(() => {
    async function fetchCompletedOrders() {
      try {
        const response = await fetch("http://localhost:3001/completed-orders", {
          credentials: "include",
        });
        if (response.ok) {
          const data = await response.json();
          setCompletedOrders(data);
        } else {
          throw new Error("Failed to fetch completed orders.");
        }
      } catch (error) {
        console.error("Error fetching completed orders:", error);
      }
    }

    fetchCompletedOrders();
  }, []);

  const toggleOrderDetails = (orderId) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  const toggleOrdersSection = (section) => {
    setExpandedOrders((prevState) => ({
      ...prevState,
      [section]: !prevState[section],
    }));
  };

  const isSectionExpanded = (section) => {
    return expandedOrders[section];
  };

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

  const removeProductFromOrder = async (productId, size) => {
    try {
      const response = await fetch(
        "http://localhost:3001/remove-product-from-order",
        {
          method: "DELETE",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ productId, size }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Usunięto produkt, odśwież listę produktów w koszyku
      fetchCartItems();
    } catch (error) {
      console.error("Error removing product from order:", error);
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
    <div className="cart-wrapper">
      <div className="cart">
        <div className="cart-items">
          <h2>Koszyk</h2>
          {cartItems.map((item) => (
            <div className="cart-item" key={item.id}>
              <div className="item-info">
                <img src={item.image} alt={item.name} className="item-image" />
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
              <button
                onClick={() => removeProductFromOrder(item.id, item.size)}
                className="remove-item-btn"
              >
                Usuń
              </button>
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
      <div className="orders-section">
        <h2 onClick={() => toggleOrdersSection("pendingOrders")}>
          Zamówienia w trakcie realizacji
        </h2>
        {isSectionExpanded("pendingOrders") && (
          <div className="pending-orders">
            {completedOrders
              .filter((order) => order.data_zlozenia_zamowienia)
              .map((order) => (
                <div key={order.id_zamowienia} className="pending-order">
                  <button
                    onClick={() => toggleOrderDetails(order.id_zamowienia)}
                  >
                    Zamówienie z dnia:{" "}
                    {new Date(
                      order.data_zlozenia_zamowienia
                    ).toLocaleDateString()}
                  </button>
                  {expandedOrderId === order.id_zamowienia && (
                    <div className="order-details">
                      {order.produkty.map((product) => (
                        <div key={product.id} className="product-details">
                          <p className="item-name">{product.nazwa}</p>
                          <p className="item-price">{product.cena} zł</p>
                          <p className="item-size">
                            Rozmiar: {product.rozmiar}
                          </p>
                          <p className="item-quantity">
                            Ilość: {product.ilosc}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Cart;
