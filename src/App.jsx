import React from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";
import Home from "./pages/Home";
import Cart from "./pages/cart/Cart";
import Wishlist from "./pages/Wishlist";
import SingleProduct from "./pages/SingleProduct";
import ProductsFilter from "./pages/ProductsFilter";
import Shop from "./pages/Shop";

const App = () => {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<ProductsFilter />} />
        <Route path="/product/:id" element={<SingleProduct />} />
        <Route path="/product-filter" element={<ProductsFilter />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/wishlist" element={<Wishlist />} />
      </Routes>
      <Footer />
    </>
  );
};

export default App;
