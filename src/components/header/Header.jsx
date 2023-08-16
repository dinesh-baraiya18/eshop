import React, { useState, useEffect, forwardRef } from "react";
import styled from "@emotion/styled";
import "./header.css";
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  List,
  ListItem,
  ListItemButton,
  Box,
  Drawer,
  Button,
  Badge,
  Dialog,
  Slide,
  IconButton,
} from "@mui/material";
import { Link, NavLink } from "react-router-dom";
import { CiSearch, CiUser, CiHeart, CiShoppingCart } from "react-icons/ci";
import { RiMenu3Fill } from "react-icons/ri";
import { GrClose } from "react-icons/gr";
import Login from "../form/Login";
import Register from "../form/Register";
import {
  onAuthStateChanged,
  signOut,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "../../firebase/firebase";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import logo from "../../assets/images/logo.png";
import { useSelector } from "react-redux";
import userProfile from "../../assets/images/user-profile.jpg";

const UlContainer = {
  hidden: { opacity: 1, scale: 0 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      delayChildren: 0.3,
      staggerChildren: 0.2,
    },
  },
};

const CustomToolbar = styled(Toolbar)`
  background: #fff;
  padding: 10px;
  color: #000;
  padding: 0 !important;
`;

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const navLinks = [
  {
    name: "home",
    path: "/",
  },
  {
    name: "shop",
    path: "/shop",
  },
  {
    name: "about",
    path: "/about",
  },
  {
    name: "blog",
    path: "/blog",
  },
  {
    name: "contact",
    path: "/contact",
  },
];

const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

const Header = () => {
  const [userIsLogin, setUserIsLogin] = useState(false);
  const [modalOpen, setmodalOpen] = useState({
    registerShow: false,
    loginShow: false,
  });
  const [state, setState] = useState(false);
  const [openSearch, setopenSearch] = useState(false);

  const handleSearchOpen = () => {
    setopenSearch(true);
  };

  const handleSearchClose = () => {
    setopenSearch(false);
  };
  // get cart  and wishlist product Quantity
  const { inCartProducts } = useSelector((state) => state.inCartProducts);
  const { wishlistProducts } = useSelector((state) => state.wishlistProducts);

  const signinWithGoogle = () => {
    signInWithPopup(auth, googleProvider);
  };
  const signinWithFacebook = () => {
    signInWithPopup(auth, facebookProvider);
  };

  // is user is login or not
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserIsLogin(true);
      }
    });
    if (userIsLogin) handleClose();
    return () => unsubscribe();
  }, [userIsLogin]);

  // log out function
  const userLogout = async () => {
    try {
      await signOut(auth);
      toast.success("Logout Successfully");
      setUserIsLogin(false);
    } catch (error) {
      toast.error(error.message);
    }
  };

  // handle Modal Open
  const handleModalOpen = (text) => {
    if (text === "login") {
      setmodalOpen({ registerShow: false, loginShow: true });
    } else if (text === "register") {
      setmodalOpen({ registerShow: true, loginShow: false });
    }
  };

  // modal close
  const handleClose = () =>
    setmodalOpen({
      registerShow: false,
      loginShow: false,
    });

  // mobile menu handle
  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setState(open);
  };

  return (
    <>
      <AppBar className="header" sx={{ background: "#fff" }}>
        <Container>
          <CustomToolbar>
            <div className="logo-wrapper">
              <Link to={"/"}>
                <img src={logo} alt="logo" />
              </Link>
            </div>
            <nav className=" d-flex gap-3 w-100 justify-content-end">
              <ul className="navlink d-flex gap-3 ms-auto">
                {navLinks?.map(({ name, path }, i) => (
                  <li key={i}>
                    <NavLink to={path}>{name}</NavLink>
                  </li>
                ))}
              </ul>
              <ul className="right-side d-flex gap-3">
                <li onClick={handleSearchOpen}>
                  <CiSearch />
                </li>
                <li>
                  <Link to={"/wishlist"}>
                    <Badge
                      badgeContent={wishlistProducts.length}
                      color="primary"
                    >
                      <CiHeart />
                    </Badge>
                  </Link>
                </li>
                <li>
                  <Link to={"/cart"}>
                    <Badge badgeContent={inCartProducts.length} color="primary">
                      <CiShoppingCart />
                    </Badge>
                  </Link>
                </li>
                <li className="dd-link">
                  {userIsLogin ? (
                    <>
                      <span className="user-profile">
                        <img src={userProfile} alt="user profile pic" />
                      </span>
                      <List className="dd-menu">
                        <ListItem>
                          <ListItemButton>My Profile</ListItemButton>
                        </ListItem>
                        <ListItem>
                          <ListItemButton>My Order</ListItemButton>
                        </ListItem>
                        <ListItem>
                          <ListItemButton onClick={userLogout}>
                            Log Out
                          </ListItemButton>
                        </ListItem>
                      </List>
                    </>
                  ) : (
                    <>
                      <span>
                        <CiUser />
                      </span>
                      <List className="dd-menu">
                        <ListItem>
                          <ListItemButton
                            onClick={() => handleModalOpen("login")}
                          >
                            Log In
                          </ListItemButton>
                        </ListItem>
                        <ListItem>
                          <ListItemButton
                            onClick={() => handleModalOpen("register")}
                          >
                            Register
                          </ListItemButton>
                        </ListItem>
                      </List>
                    </>
                  )}
                </li>
                <li className="menu-icon">
                  <span onClick={toggleDrawer(true)}>
                    <RiMenu3Fill color="#000" />
                  </span>
                </li>
              </ul>
            </nav>
          </CustomToolbar>
        </Container>
      </AppBar>

      {/* ///////  Mobile menu ////////// */}
      <Drawer anchor="right" open={state} onClose={toggleDrawer(false)}>
        <Box
          className="mobile-menu"
          sx={{ width: "300px" }}
          role="presentation"
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
        >
          <div className="d-flex justify-content-between align-items-center top-header">
            <Typography variant="h4">Eshop</Typography>
            <Button sx={{ minWidth: "unset" }}>
              <GrClose style={{ fontSize: "24px" }} />
            </Button>
          </div>
          <motion.List
            className="mobile-links"
            variants={UlContainer}
            initial="hidden"
            animate="visible"
          >
            {navLinks?.map(({ name, path }, i) => (
              <motion.li
                key={i}
                initial={{ x: -30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: i * 0.2 }}
              >
                <ListItemButton>
                  <NavLink to={path}>{name}</NavLink>
                </ListItemButton>
              </motion.li>
            ))}
          </motion.List>
        </Box>
      </Drawer>

      {modalOpen.loginShow || modalOpen.registerShow ? (
        <Dialog
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
          open={modalOpen.loginShow || modalOpen.registerShow}
          onClose={handleClose}
        >
          {modalOpen.loginShow ? (
            <Login
              handleModalFun={handleModalOpen}
              handleClose={handleClose}
              signinWithGoogle={signinWithGoogle}
              signinWithFacebook={signinWithFacebook}
            />
          ) : (
            <Register
              handleModalFun={handleModalOpen}
              handleClose={handleClose}
              signinWithGoogle={signinWithGoogle}
              signinWithFacebook={signinWithFacebook}
            />
          )}
        </Dialog>
      ) : null}

      <Dialog
        fullScreen
        open={openSearch}
        onClose={handleSearchClose}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: "relative" }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleSearchClose}
              aria-label="close"
              className="search-close-icon"
            >
              <GrClose />
            </IconButton>
            <div className="searchbar-container">
              <input type="text" placeholder="Search Here..." />
              <Button variant="contained" color="secondary">
                Seach
              </Button>
            </div>
          </Toolbar>
        </AppBar>
      </Dialog>
    </>
  );
};

export default Header;
