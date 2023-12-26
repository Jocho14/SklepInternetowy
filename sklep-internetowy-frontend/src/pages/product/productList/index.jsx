import React, { useState, useEffect } from "react";
import { getProducts } from "../../../services/api/api";
import { Link } from "react-router-dom";
import "./styles.scss";

function ProductList() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    async function loadProducts() {
      const data = await getProducts();
      setProducts(data);
    }
    loadProducts();
  }, []);

  const seenNames = new Set();
  const uniqueProducts = products.filter((product) => {
    if (seenNames.has(product.nazwa)) {
      return false;
    } else {
      seenNames.add(product.nazwa);
      return true;
    }
  });

  const productElements = uniqueProducts.map((product) => (
    <Link
      to={`/products/${product.id_produktu}`}
      key={product.id_produktu}
      className="product"
    >
      <div className="product-image-wrapper">
        <img
          src={product.obrazek}
          alt={product.nazwa}
          className="product__image"
        />
      </div>
      <div className="product__info">
        <h3>{product.nazwa}</h3>
        <p>{product.cena_netto_sprzedazy}zł</p>
      </div>
    </Link>
  ));

  return (
    <div className="product__container">
      <h1>Zobacz nasze produkty</h1>
      <div className="product__container__list">{productElements}</div>
    </div>
  );
}

export default ProductList;
