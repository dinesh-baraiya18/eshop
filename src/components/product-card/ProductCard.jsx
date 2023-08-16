import "./productCard.css";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Rating,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { GoHeart, GoHeartFill } from "react-icons/go";
import { useDispatch } from "react-redux";
import { addToCartFun } from "../../redux/features/products/addToCartSlice";
import {
  addToWishlist,
  removeToWishlist,
} from "../../redux/features/products/wishlistProductsSlice";
import { auth } from "../../firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { toast } from "react-toastify";

const ProductCard = ({ product, inWishlist, horizontalGrid }) => {
  const [wishlistIcon, setWishlistIcon] = useState(false);
  const { id, image, price, rating, title } = product;
  const dispatch = useDispatch();

  useEffect(() => {
    if (inWishlist) {
      setWishlistIcon((prevWishlistIcon) => !prevWishlistIcon);
    }
  }, [inWishlist]);

  // check user is log in or not
  const handleWishlist = (wishlistProduct) => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        if (!wishlistIcon) {
          dispatch(addToWishlist(wishlistProduct));
          setWishlistIcon(true);
        } else {
          dispatch(removeToWishlist(wishlistProduct));
          setWishlistIcon(false);
        }
      } else {
        toast.warning("Login To Add Wishlist");
      }
    });
  };
  return (
    <div className="product-card">
      <Card className="product-inner">
        <div className="product-topbar">
          <span>new</span>
          <Button onClick={() => handleWishlist(product)}>
            {wishlistIcon || inWishlist ? <GoHeartFill /> : <GoHeart />}
          </Button>
        </div>
        <div
          className={
            horizontalGrid ? " horizontalGrid d-flex align-items-center" : ""
          }
        >
          <Link to={`/product/${id}`} className="img-wrapper">
            <img src={image} alt="product img" />
          </Link>
          <div style={{ flex: 1 }}>
            <CardContent>
              <Typography
                gutterBottom
                component="div"
                className="product-title"
              >
                <Link to={`/product/${id}`}>{title}</Link>
              </Typography>
              <div className="rating d-flex align-items-center gap-2">
                <Rating
                  name="rating"
                  defaultValue={rating.rate}
                  precision={0.5}
                  readOnly
                />
                <span style={{ lineHeight: 1 }}>{`(${rating.count})`}</span>
              </div>
            </CardContent>
            <CardActions className="justify-content-between p-3">
              <div className="price"> ${price}</div>
              <Button
                variant="contained"
                className="btn"
                onClick={() => dispatch(addToCartFun(product))}
              >
                Add To Cart
              </Button>
            </CardActions>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ProductCard;
