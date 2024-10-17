import { useQuery } from "@tanstack/react-query";
import { ProductType } from "../type";
import "./product.css";
import { useState } from "react";
import React from "react";
import Modal from "./Modal";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircle from "@mui/icons-material/AccountCircle";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import MenuItem from "@mui/material/MenuItem";

import {
  Badge,
  Card,
  CardContent,
  CardMedia,
  Container,
  FormControl,
  Grid,
  Select,
  SelectChangeEvent,
  TextField,
} from "@mui/material";
import ProductCard from "./ProductCard";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import DeleteIcon from "@mui/icons-material/Delete";

const Products = () => {
  const [text, setText] = useState<string>("");
  const [category, setCategory] = useState<string>("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cartProduct, setCartProduct] = useState<ProductType[]>([]);

  const { isPending, error, data } = useQuery({
    queryKey: ["products"],
    queryFn: (): Promise<ProductType[]> =>
      fetch("https://fakestoreapi.com/products").then((res) => res.json()),
  });
  const { data: categoryData } = useQuery({
    queryKey: ["productsCategory"],
    queryFn: (): Promise<string[]> =>
      fetch("https://fakestoreapi.com/products/categories").then((res) =>
        res.json()
      ),
  });
  const openModal = () => {
    if (cartProduct.length !== 0) {
      setIsModalOpen(true);
    }
  };
  function addToCart(product: ProductType) {
    const existingProduct = cartProduct.find(
      (products) => products.id === product.id
    );
    product.quantity = 1;
    if (existingProduct) {
      setCartProduct(
        cartProduct.map((products) =>
          products.id === product.id
            ? {
                ...product,
                quantity: Number(products.quantity) + Number(product.quantity),
              }
            : products
        )
      );
    } else {
      setCartProduct([...cartProduct, product]);
    }
  }
  const handleIncrease = (id: number) => {
    setCartProduct(
      cartProduct.map((products) =>
        products.id === id
          ? {
              ...products,
              quantity: Number(products.quantity) + 1,
            }
          : products
      )
    );
  };

  const handleDecrease = (id: number) => {
    const existingProduct = cartProduct.find((products) => products.id == id);
    if (existingProduct) {
      if (existingProduct.quantity > 1) {
        setCartProduct(
          cartProduct.map((products) =>
            products.id === id
              ? {
                  ...products,
                  quantity: Number(products.quantity) - 1,
                }
              : products
          )
        );
      } else {
        deleteProductFromCart(id);
      }
    }
  };

  const closeModal = () => {
    setCartProduct([]);
    setIsModalOpen(false);
  };
  function deleteProductFromCart(id: number) {
    if (cartProduct.length === 1) {
      setIsModalOpen(false);
      setCartProduct((prevCartProducts) =>
        prevCartProducts.filter((product) => product.id !== id)
      );
    } else {
      setCartProduct((prevCartProducts) =>
        prevCartProducts.filter((product) => product.id !== id)
      );
    }
  }

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="fixed">
          <Toolbar
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>

              <TextField
                id="outlined-basic"
                variant="outlined"
                size="small"
                label="Search by title"
                value={text}
                onChange={(e) => setText(e.target.value)}
                sx={{
                  backgroundColor: "#f0f0f0",
                  "&:hover": {
                    backgroundColor: "#e0e0e0",
                  },
                  ".MuiSelect-select": {
                    backgroundColor: "#f0f0f0",
                  },
                }}
              />

              <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                <Select
                  labelId="demo-select-small-label"
                  id="demo-select-small"
                  value={category}
                  label="Age"
                  onChange={(e) => setCategory(e.target.value)}
                  sx={{
                    backgroundColor: "#f0f0f0",
                    "&:hover": {
                      backgroundColor: "#e0e0e0",
                    },
                    ".MuiSelect-select": {
                      backgroundColor: "#f0f0f0",
                    },
                  }}
                >
                  <MenuItem value="All">
                    <em>All</em>
                  </MenuItem>

                  {categoryData?.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>

            <div>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                color="inherit"
                onClick={() => openModal()}
              >
                <Badge badgeContent={cartProduct.length} color="error">
                  <ShoppingCartIcon sx={{ cursor: "pointer" }} />
                </Badge>
              </IconButton>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
            </div>
          </Toolbar>
        </AppBar>
      </Box>
      <section style={{ width: "100vw", height: "100vh", marginTop: "6rem" }}>
        {isPending ? (
          <Container
            maxWidth="lg"
            sx={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "2rem",
              paddingBottom: "2rem",
            }}
          >
            <span> loading ...</span>
          </Container>
        ) : error ? (
          <Container
            maxWidth="lg"
            sx={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "2rem",
              paddingBottom: "2rem",
            }}
          >
            <span>error + {error.message}</span>
          </Container>
        ) : data.filter((product) => {
            if (category === "All") {
              return (
                true && product.title.toLowerCase().includes(text.toLowerCase())
              );
            } else {
              return (
                product.category === category &&
                product.title.toLowerCase().includes(text.toLowerCase())
              );
            }
          }).length === 0 ? (
          <Container
            maxWidth="lg"
            sx={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "2rem",
              paddingBottom: "2rem",
            }}
          >
            <span>No data found</span>
          </Container>
        ) : (
          <Container
            maxWidth="lg"
            sx={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "2rem",
              paddingBottom: "2rem",
            }}
          >
            <Grid spacing={2} container>
              {data
                .filter((product) => {
                  if (category === "All") {
                    return (
                      true &&
                      product.title.toLowerCase().includes(text.toLowerCase())
                    );
                  } else {
                    return (
                      product.category === category &&
                      product.title.toLowerCase().includes(text.toLowerCase())
                    );
                  }
                })
                .map((product) => (
                  <Grid item xs={12} sm={6} md={4} lg={3}>
                    <ProductCard
                      product={product}
                      addToCart={addToCart}
                      deleteProductFromCart={deleteProductFromCart}
                      handleDecrease={handleDecrease}
                      handleIncrease={handleIncrease}
                    />
                  </Grid>
                ))}
            </Grid>
          </Container>
        )}
      </section>
      <Modal show={isModalOpen} onClose={closeModal}>
        <h2
          style={{
            marginBottom: "1rem",
          }}
        >
          Shopping cart
        </h2>

        {cartProduct.map((product) => (
          <Card
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "0.5rem",
              height: "auto",
            }}
          >
            <CardMedia
              component="img"
              sx={{
                width: 100,
                height: 100,
                objectFit: "contain",
                aspectRatio: "3/4",
              }}
              image={product.image}
              alt={product.title}
            />

            <CardContent sx={{ textAlign: "center" }}>
              <Typography variant="h6" sx={{ fontSize: "0.875rem" }}>
                {product.title.substring(0, 30)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                ₹{product.price.toFixed(2)}
              </Typography>

              <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
                <IconButton
                  onClick={() => handleDecrease(product.id)}
                  size="small"
                  disabled={product.quantity === 1}
                >
                  <RemoveIcon />
                </IconButton>
                <Typography variant="body1" sx={{ padding: "0 12px" }}>
                  {product.quantity}
                </Typography>
                <IconButton
                  onClick={() => handleIncrease(product.id)}
                  size="small"
                >
                  <AddIcon />
                </IconButton>
                <IconButton
                  size="small"
                  aria-label="delete"
                  onClick={() => deleteProductFromCart(product.id)}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Modal>
    </>
  );
};
export default Products;
