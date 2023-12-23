import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getProducts, getSizes } from "../../../services/api/api";
import { NavLink } from "react-router-dom";
import SizeSelector from "../../../components/SizeSelector";
import "./styles.scss";

function ProductDetail() {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [sizes, setSizes] = useState([]);
  const [selectedSize, setSelectedSize] = useState("");
  const [isSizeError, setIsSizeError] = useState(false);

  useEffect(() => {
    async function loadProductDetails() {
      try {
        const products = await getProducts();
        const foundProduct = products.find(
          (p) => p.id_produktu.toString() === productId
        );
        setProduct(foundProduct);

        if (foundProduct) {
          const sizesData = await getSizes(foundProduct.nazwa);
          const sizesArray = sizesData.map((s) => s.rozmiar); // Wyodrębnij wartości rozmiaru

          setSizes(sizesArray);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    }

    loadProductDetails();
  }, [productId]);

  if (!product) {
    return <div>Loading...</div>;
  }

  const handleAddToCart = () => {
    if (!selectedSize) {
      setIsSizeError(true);
      return;
    }
    console.log("Produkt dodany do koszyka:", product.nazwa, selectedSize);
    // Tutaj możesz dodać logikę dodawania produktu do koszyka
  };

  return (
    <div className="product_container">
      <div className="navlink__wrapper">
        <NavLink className="navlink__wrapper__arrow" to="/products">
          ←Powrót
        </NavLink>
      </div>

      <div className="product__detail__wrapper">
        <div className="product__detail__container">
          <div className="product__detail__container__left">
            <img
              src={product.obrazek}
              alt={product.nazwa}
              className="product__detail__container__left__image"
            />
          </div>

          <div className="product__detail__container__right">
            <div className="product__detail__container__right__info">
              <h2>{product.nazwa}</h2>
              <p>{product.cena_netto_sprzedazy}zł</p>
              <h4 className="product__detail__description">{product.opis}</h4>
              <div className="product__detail__container__size">
                <h4
                  className={`size__title ${isSizeError ? "size__error" : ""}`}
                >
                  Wybierz rozmiar
                </h4>
                <div className="product__detail__container__size__list">
                  <SizeSelector
                    sizes={sizes}
                    selectedSize={selectedSize}
                    onSelectSize={(size) => {
                      setSelectedSize(size);
                      setIsSizeError(false);
                    }}
                    isSizeError={isSizeError}
                  />
                </div>
                <button className="add-to-cart-btn" onClick={handleAddToCart}>
                  Dodaj do koszyka
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
