import React from "react";
import "./styles.scss"; // Załóżmy, że style są zdefiniowane w tym pliku

function SizeSelector({ sizes, onSelectSize, selectedSize, isSizeError }) {
  const handleSizeClick = (size) => {
    onSelectSize(size);
  };

  return (
    <div className={`size-selector ${isSizeError ? "error" : ""}`}>
      <div className="size-options">
        {sizes.map((size, index) => (
          <button
            key={index}
            className={`size-option ${selectedSize === size ? "selected" : ""}`}
            onClick={() => handleSizeClick(size)}
          >
            {size}
          </button>
        ))}
      </div>
    </div>
  );
}

export default SizeSelector;
