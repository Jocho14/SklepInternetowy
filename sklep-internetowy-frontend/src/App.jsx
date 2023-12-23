import Main from "./components/layouts/Main";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  BrowserRouter,
} from "react-router-dom";
import "./App.css";
import ProductList from "./pages/product/productList";
import ProductDetail from "./pages/product/productDetail"; // Zaimportuj komponent ProductDetail
import Home from "./pages/Home";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Main />}>
          <Route index element={<Home />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/products/:productId" element={<ProductDetail />} />{" "}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
