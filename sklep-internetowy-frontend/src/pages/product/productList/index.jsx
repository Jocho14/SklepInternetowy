import React, { useState, useEffect } from "react";
import { getProducts } from "../../../services/api/api";
import "./styles.scss";

function ProductList() {
  const [products, setProducts] = useState([]);
  const [images, setImages] = useState([]);

  useEffect(() => {
    async function loadProducts() {
      const data = await getProducts();
      setProducts(data);
    }
    loadProducts();
  }, []);

  const productElements = products.map((product) => (
    <div key={product.id_produktu} className="product">
      <img src className="product__image"></img>
      <div className="product__info">
        <h3>{product.nazwa}</h3>
        <p>{product.cena_netto_sprzedazy}</p>
      </div>
    </div>
  ));

  return (
    <div className="product__container">
      <h1>Zobacz nasze produkty</h1>
      <div className="product__container__list">{productElements}</div>
    </div>
  );
}

export default ProductList;
