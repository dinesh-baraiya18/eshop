import React, { useEffect } from "react";
import HeroBanner from "../components/HeroBanner";
import { Container } from "@mui/material";
import { Col, Row } from "react-bootstrap";
import ProductCard from "../components/product-card/ProductCard";
import { AiOutlineArrowRight } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductData } from "../redux/features/products/fetchProductsSlice";
import ProductSkeleton from "../components/product-card/ProductSkeleton";
import { Link } from "react-router-dom";

const Home = () => {
  const { allproductsData, loading, error } = useSelector(
    (state) => state.products
  );

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchProductData());
  }, [dispatch]);

  if (error) {
    <div>{error.message}</div>;
  }

  return (
    <>
      <HeroBanner />
      <section className="collection-section pt pb">
        <Container>
          <div className="inner">
            <div className="section-title  d-flex justify-content-between align-items-end gap-2">
              <div className="inner-title">
                <span className="subtitle">new</span>
                <h2>Collection</h2>
              </div>
              <Link to="/shop" className="d-flex gap-2">
                Show More
                <AiOutlineArrowRight />
              </Link>
            </div>
            <Row className="row-gap">
              {loading
                ? Array.from({ length: 8 }).map((_, index) => (
                    <Col xs={12} sm={6} md={4} lg={3} key={index}>
                      <ProductSkeleton />
                    </Col>
                  ))
                : allproductsData?.slice(0, 8).map((product) => (
                    <Col xs={12} sm={6} md={4} lg={3} key={product.id}>
                      <ProductCard product={product} />
                    </Col>
                  ))}
            </Row>
          </div>
        </Container>
      </section>
    </>
  );
};

export default Home;
