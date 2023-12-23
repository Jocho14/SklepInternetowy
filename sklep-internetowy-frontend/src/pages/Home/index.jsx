import React, { useState, useEffect } from "react";
import "./styles.scss";

function Home() {
  const words = ["styl", "design", "charakter", "gust", "kunszt"];
  const [currentWord, setCurrentWord] = useState(words[0]);
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setOpacity(0);

      setTimeout(() => {
        setCurrentWord((prevWord) => {
          const currentIndex = words.indexOf(prevWord);
          const nextIndex = (currentIndex + 1) % words.length;
          return words[nextIndex];
        });

        setOpacity(1);
      }, 1000);
    }, 5000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="home__wrapper">
      <div className="home__container">
        <div className="home__container__background">
          <h1>
            Odkryj swój <span style={{ opacity: opacity }}>{currentWord}</span>
          </h1>
        </div>
      </div>
    </div>
  );
}

export default Home;
