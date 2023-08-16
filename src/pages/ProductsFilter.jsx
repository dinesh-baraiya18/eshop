import React, { useEffect, useState } from "react";
import {
  Button,
  Checkbox,
  Container,
  FormControl,
  FormControlLabel,
  FormGroup,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Slider,
} from "@mui/material";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { MdArrowBackIos } from "react-icons/md";
import { Col, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import ProductCard from "../components/product-card/ProductCard";
import ProductSkeleton from "../components/product-card/ProductSkeleton";
import { CiGrid2H, CiGrid41 } from "react-icons/ci";
import { fetchProductData } from "../redux/features/products/fetchProductsSlice";
import Loader from "../components/Loader";
import { toast } from "react-toastify";
// import { AiFillStar } from "react-icons/ai";

const minDistance = 10;

const ProductsFilter = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchProductData());
  }, [dispatch]);

  const { allproductsData, loading, error } = useSelector(
    (state) => state.products
  );

  const allProductPrice = allproductsData.map((item) => item.price);
  const minPrice =
    allProductPrice.length > 0 ? Math.floor(Math.min(...allProductPrice)) : 0;
  const maxPrice =
    allProductPrice.length > 0 ? Math.ceil(Math.max(...allProductPrice)) : 1000;

  // states
  const [loadmore, setLoadMore] = useState(9);
  const [sorting, setSorting] = useState("");
  const [pricerange, setPricerange] = useState([minPrice, maxPrice]);
  const [products, setProducts] = useState(allproductsData || []);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [horizontalGrid, setHorizontalGrid] = useState(false);

  useEffect(() => {
    if (allproductsData.length > 0) {
      setProducts(allproductsData);
    }
    setSorting("");
  }, [allproductsData]);

  // get all category
  const categories = [
    "All",
    ...new Set(allproductsData.map((item) => item.category)),
  ];
  // handle Categories
  const handleCategories = (category) => {
    const filterBYCategory = allproductsData.filter(
      (item) => item.category === category
    );
    setProducts(filterBYCategory);
    if (category === "All") {
      setProducts(allproductsData);
    }
    setSelectedCategory(category);
  };

  // filter product by price range
  const handleFilterProductByPrice = ([min, max]) => {
    const filterProductByPrice = allproductsData.filter((item) => {
      if (selectedCategory === "All") {
        return item.price >= min && item.price <= max;
      } else {
        return (
          item.price >= min &&
          item.price <= max &&
          item.category === selectedCategory
        );
      }
    });
    setProducts(filterProductByPrice);
  };
  // handelrange
  const handlePriceRange = (event, newValue, activeThumb) => {
    if (!Array.isArray(newValue)) {
      return;
    }
    if (activeThumb === 0) {
      setPricerange([
        Math.min(newValue[0], pricerange[1] - minDistance),
        pricerange[1],
      ]);
    } else {
      setPricerange([
        pricerange[0],
        Math.max(newValue[1], pricerange[0] + minDistance),
      ]);
    }
    handleFilterProductByPrice(newValue);
  };

  // handle Load More
  const handleLoadMore = () => setLoadMore((preValue) => preValue + 6);

  // is loading
  if (loading) {
    return <Loader />;
  }
  // is error
  if (error) {
    return <div>{error.message}</div>;
  }

  // Sort by
  const selectChange = (event) => {
    const getSortBy = event.target.value;

    const sortFunctions = {
      AtoZ: (a, b) => a.title.localeCompare(b.title),
      ZtoA: (a, b) => b.title.localeCompare(a.title),
      priceLowToHigh: (a, b) => a.price - b.price,
      priceHighToLow: (a, b) => b.price - a.price,
      rating: (a, b) => b.rating.rate - a.rating.rate,
    };
    const sortedProducts = [...products].sort(sortFunctions[getSortBy]);

    setSorting(getSortBy);
    setProducts(sortedProducts);
  };

  // handle Clear Filter
  const handleClearFilter = () => {
    setProducts(allproductsData);
    setSorting("");
    setSelectedCategory("All");
    setHorizontalGrid(false);
    setPricerange([minPrice, maxPrice]);
    toast.success("All Filter Cleared");
  };

  return (
    <FilterSection className="pt">
      <Container>
        <Button sx={{ marginBottom: "10px" }}>
          <Link to={"/"}>
            <MdArrowBackIos />
            go to back
          </Link>
        </Button>
        <div className="section-title">
          <div className="inner-title">
            <span className="subtitle">filter</span>
            <h2>Products</h2>
          </div>
        </div>
        <Row>
          <Col sm={12} md={3}>
            <div className="leftbar-filter">
              <h5>Filter</h5>
              <div className="filter-div mt-3 radio-grp">
                <label>category</label>
                <FormControl>
                  <RadioGroup
                    aria-labelledby="products-category"
                    defaultValue="All"
                  >
                    {categories?.map((category, i) => (
                      <FormControlLabel
                        key={i}
                        value={category}
                        control={
                          <Radio
                            className="custom-radio"
                            onChange={() => handleCategories(category)}
                          />
                        }
                        label={category}
                        sx={{
                          color: "#222 !important",
                        }}
                      />
                    ))}
                  </RadioGroup>
                </FormControl>
              </div>
              <div className="filter-div mt-3">
                <label>price range</label>
                <div className="d-flex gap-2 mb-4 justify-content-between">
                  <div className="d-flex gap-2">
                    <span>Min</span>
                    <div>{pricerange[0]}</div>
                  </div>
                  <span>-</span>
                  <div className="d-flex gap-2">
                    <span>Max</span>
                    <div>{pricerange[1]}</div>
                  </div>
                </div>
                <Slider
                  getAriaLabel={() => "Minimum distance"}
                  value={pricerange}
                  onChange={handlePriceRange}
                  valueLabelDisplay="auto"
                  disableSwap
                  min={minPrice}
                  max={maxPrice}
                />
              </div>
              {/* <div className="filter-div rating mt-3">
                <label>rating</label>
                <FormGroup>
                  <FormControlLabel
                    control={<Checkbox />}
                    label={
                      <>
                        <AiFillStar />
                        <AiFillStar />
                        <AiFillStar />
                        <AiFillStar />
                        <AiFillStar />
                      </>
                    }
                    labelPlacement="start"
                  />
                </FormGroup>
              </div> */}
              <div className="text-center mt-4">
                <Button
                  variant="contained"
                  color="secondary"
                  className="w-100"
                  onClick={handleClearFilter}
                >
                  Clear Filter
                </Button>
              </div>
            </div>
          </Col>
          <Col sm={12} md={9}>
            <div className="rightbar">
              <div className="topbar d-flex align-items-center justify-content-between ">
                <div className="d-flex gap-3">
                  <div>
                    <Button onClick={() => setHorizontalGrid(false)}>
                      <CiGrid41 fontSize={24} />
                    </Button>
                    <Button
                      className="ms-1"
                      onClick={() => setHorizontalGrid(true)}
                    >
                      <CiGrid2H fontSize={24} />
                    </Button>
                  </div>
                </div>
                <FormControl
                  size="small"
                  className="sortting-select"
                  sx={{ m: 1, minWidth: 120 }}
                >
                  <Select
                    value={sorting}
                    onChange={selectChange}
                    displayEmpty
                    // inputProps={{ "aria-label": "Without label" }}
                  >
                    <MenuItem value="">
                      <span>Sort</span>
                    </MenuItem>
                    <MenuItem value={"AtoZ"}>Name: A-Z</MenuItem>
                    <MenuItem value={"ZtoA"}>Name: Z-A</MenuItem>
                    <MenuItem value={"priceLowToHigh"}>
                      price: low to high
                    </MenuItem>
                    <MenuItem value={"priceHighToLow"}>
                      price: high to low
                    </MenuItem>
                    <MenuItem value={"rating"}> High Rating</MenuItem>
                  </Select>
                </FormControl>
              </div>
              {horizontalGrid ? (
                <Row className="gap-3">
                  {loading
                    ? Array.from({ length: 9 }).map((_, index) => (
                        <Col xs={12} key={index}>
                          <ProductSkeleton />
                        </Col>
                      ))
                    : products.slice(0, loadmore).map((product) => (
                        <Col xs={12} key={product.id}>
                          <ProductCard
                            product={product}
                            horizontalGrid={horizontalGrid}
                          />
                        </Col>
                      ))}
                  {products.length >= loadmore && (
                    <div className="d-flex justify-content-center">
                      <Button
                        onClick={handleLoadMore}
                        variant="contained"
                        color="secondary"
                        className="load-more-btn"
                      >
                        Load More
                      </Button>
                    </div>
                  )}
                </Row>
              ) : (
                <Row className="row-gap">
                  {loading
                    ? Array.from({ length: 9 }).map((_, index) => (
                        <Col xs={12} sm={12} md={6} lg={4} key={index}>
                          <ProductSkeleton />
                        </Col>
                      ))
                    : products.slice(0, loadmore).map((product) => (
                        <Col xs={12} sm={12} md={6} lg={4} key={product.id}>
                          <ProductCard
                            product={product}
                            horizontalGrid={horizontalGrid}
                          />
                        </Col>
                      ))}
                  {products.length >= loadmore && (
                    <div className="d-flex justify-content-center">
                      <Button
                        onClick={handleLoadMore}
                        variant="contained"
                        color="secondary"
                        className="load-more-btn"
                      >
                        Load More
                      </Button>
                    </div>
                  )}
                </Row>
              )}
            </div>
          </Col>
        </Row>
      </Container>
    </FilterSection>
  );
};

export default ProductsFilter;

const FilterSection = styled.section`
  .topbar {
    border-bottom: 2px solid var(--second-color);
    padding: 10px 0;
    margin-bottom: 15px;
  }

  .leftbar-filter {
    position: sticky;
    top: 75px;

    .filter-div {
      box-shadow: 0 0 10px 0 rgb(0 0 0 / 10%);
      padding: 20px 15px;
      border-radius: 10px;

      label {
        display: block;
        margin-bottom: 15px;
        text-transform: capitalize;
        color: var(--theme-color);
        font-weight: 600;
      }
    }
    .radio-grp label span input + span {
      display: none;
    }
    .radio-grp label span input + span {
      display: none;
    }
    .Mui-checked + span {
      color: var(--second-color) !important;
      text-decoration: underline;
    }
  }
  .rating .MuiFormGroup-root label {
    display: flex !important;
    justify-content: space-between;
    align-items: center;
    gap: 10px;
    margin-left: 0;
  }
`;
