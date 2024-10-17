import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  CardActions,
  Button,
  Box,
  Rating,
  IconButton,
} from "@mui/material";
import { ProductType } from "../type";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
const ProductCard = ({
  product,
  addToCart,
  cartProduct,
  handleDecrease,
  handleIncrease,
}: {
  product: ProductType;
  addToCart: (product: ProductType) => void;
  cartProduct: ProductType[];
  handleDecrease: (id: number) => void;
  handleIncrease: (id: number) => void;
}) => {
  const foundProduct = cartProduct.find(
    (products) => products.id === product.id
  );
  const quantity = foundProduct ? foundProduct.quantity : 0;
  return (
    <Card sx={{ maxWidth: 345, height: "auto" }}>
      <CardMedia
        component="img"
        height="140"
        image={product.image}
        alt="Sample Image"
        sx={{ objectFit: "contain", aspectRatio: "3/4" }}
      />

      <CardContent
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          height: "100%",
        }}
      >
        <Typography
          sx={{
            fontSize: "0.875rem",
          }}
          variant="h6"
          component="div"
        >
          {product.title.substring(0, 30)}...
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {product.description.substring(0, 60)}...
        </Typography>
        <Box sx={{ marginTop: 1, display: "flex", alignItems: "center" }}>
          <Rating
            name="product-rating"
            value={product.rating.rate}
            precision={0.5}
            readOnly
          />
          <Typography sx={{ marginLeft: 1 }}>
            {product.rating.count.toFixed(1)}
          </Typography>
        </Box>
      </CardContent>

      <CardActions sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography
          variant="h6"
          component="div"
          color="green"
          sx={{ fontWeight: "bold", marginTop: 1 }}
        >
          ₹{product.price.toFixed(2)}
        </Typography>
        {quantity ? (
          <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
            <IconButton
              onClick={() => handleDecrease(product.id)}
              size="small"
              sx={{
                "&:focus": {
                  outline: "none",
                },
              }}
            >
              <RemoveIcon />
            </IconButton>
            <Typography variant="body1" sx={{ padding: "0 12px" }}>
              {quantity}
            </Typography>
            <IconButton
              sx={{
                "&:focus": {
                  outline: "none",
                },
              }}
              onClick={() => handleIncrease(product.id)}
              size="small"
            >
              <AddIcon />
            </IconButton>
          </Box>
        ) : (
          <Button
            variant="outlined"
            startIcon={
              <AddShoppingCartIcon
                sx={{
                  "&:focus": {
                    outline: "none",
                  },
                }}
              />
            }
            onClick={() => addToCart(product)}
            size="small"
          >
            Add to cart
          </Button>
        )}
      </CardActions>
    </Card>
  );
};
export default ProductCard;
