import React from "react";
import "./cart.css";
import { Button, Container, Typography } from "@mui/material";
import { MdArrowBackIos } from "react-icons/md";
import { Col, Row } from "react-bootstrap";
import { AiOutlineDelete } from "react-icons/ai";
import Quantity from "../../components/Quantity";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../components/Loader";
import emptyCartImg from "../../assets/images/empty-cart.webp";
import { Link } from "react-router-dom";
import { removeToCartFun } from "../../redux/features/products/addToCartSlice";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase/firebase";
import { toast } from "react-toastify";

const Cart = () => {
  const { loading, inCartProducts, error } = useSelector(
    (state) => state.inCartProducts
  );
  const dispatch = useDispatch();

  // checkout handle
  const handleCheckout = () => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        toast.success("checkout success..");
      } else {
        toast.warning("Login To Checkout");
      }
    });
  };

  // Sub Total Price
  const subTotal = inCartProducts.reduce((total, product) => {
    total += product.price * (product.quantity ? product.quantity : 1);
    return total;
  }, 0);

  // Tax Price
  const taxPercentage = 6.25;
  const TaxPrice = (subTotal * 6.25) / 100;

  // Delivery Charge
  const deliveryCharge = subTotal > 100 ? "free" : 30;

  // Total Price
  const TotalPrice =
    subTotal + TaxPrice + (deliveryCharge !== "free" ? deliveryCharge : null);

  // Total Items
  const totalItems = inCartProducts.reduce((totalItems, product) => {
    totalItems += product.quantity;
    return Number(totalItems);
  }, 0);

  console.log(totalItems);
  // error handle
  if (error) {
    <div>
      <Typography>Error : {error.message}</Typography>
    </div>;
  }

  return (
    <div className="view-cart pt-5">
      <Container>
        <Button sx={{ marginBottom: "10px" }}>
          <Link to={"/"}>
            <MdArrowBackIos />
            go to back
          </Link>
        </Button>
        <div className="section-title">
          <div className="inner-title">
            <span className="subtitle">view</span>
            <h2>Cart</h2>
          </div>
        </div>
        <div className="cart-container">
          {inCartProducts.length === 0 ? (
            <div className="empty-cart-container">
              <div>
                <img src={emptyCartImg} alt="img" className="mb-2" />
                <h2>No Item Available</h2>
                <Button variant="contained" className="mt-4">
                  <Link to="/">Go To Shop</Link>
                </Button>
              </div>
            </div>
          ) : loading ? (
            <Loader />
          ) : (
            <Row>
              <Col sm={12} md={8}>
                <div className="main-cart-inner">
                  {inCartProducts?.map((product) => {
                    const { id, title, image, price, quantity } = product;
                    return (
                      <div className="cart" key={id}>
                        <div className="left-side">
                          <Link to={`/product/${id}`} className="img-wrapper">
                            <img src={image} alt="product img" />
                          </Link>
                          <div className="detail-content">
                            <h6>
                              <Link to={`/product/${id}`}>{title}</Link>
                            </h6>
                            <div className="price mb-3">$ {price}</div>
                            <Quantity product={product} />
                          </div>
                        </div>
                        <div className="d-flex gap-3 align-items-center align-self-start">
                          <div className="price">
                            ${(quantity ? price * quantity : price).toFixed(2)}
                          </div>
                          <Button onClick={() => dispatch(removeToCartFun(id))}>
                            <AiOutlineDelete size={25} />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                  <div className="bottom-info">
                    <div>total items : {totalItems}</div>
                    <div>sub total : {`$ ${subTotal.toFixed(2)}`}</div>
                  </div>
                </div>
              </Col>
              <Col sm={12} md={4}>
                <div className="cart-price-details mt-4 mt-md-0">
                  <h4>Total</h4>
                  <div className="mt-3">
                    <div className="price-info">
                      <label htmlFor="">Sub Total: </label>
                      <span> $ {subTotal.toFixed(2)} </span>
                    </div>
                    <div className="price-info">
                      <label htmlFor="">Tax ({taxPercentage}%):</label>
                      <span> $ {TaxPrice.toFixed(2)}</span>
                    </div>
                    <div className="price-info">
                      <label htmlFor="">
                        Delivery Charges:{" "}
                        <span
                          className="d-block text-secondary"
                          style={{ fontSize: "11px" }}
                        >
                          free when $100 above
                        </span>
                      </label>
                      <span>
                        {deliveryCharge === "free" ? (
                          <span className="text-success">Free *</span>
                        ) : (
                          "$" + deliveryCharge
                        )}
                      </span>
                    </div>
                  </div>
                  <div className="price-info total">
                    <label htmlFor="">Total:</label>
                    <span> $ {TotalPrice.toFixed(2)} </span>
                  </div>
                  <Button
                    variant="contained"
                    className="checkout-btn"
                    onClick={handleCheckout}
                  >
                    Checkout
                  </Button>
                </div>
              </Col>
            </Row>
          )}
        </div>
      </Container>
    </div>
  );
};

export default Cart;
