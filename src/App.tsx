import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Products from "./components/Products";
import Product from "./components/Product";
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Products />} />
          <Route path="product/:teamId" element={<Product />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
