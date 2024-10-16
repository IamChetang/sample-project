import { useQuery } from "@tanstack/react-query";
import { ProductType } from "../type";
import "./product.css";
import { useState } from "react";
import React from "react";
import Modal from "./Modal";
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
  const openModal = (product: any) => {
    const existingProduct = cartProduct.find(
      (products) => products.id === product.id
    );
    product.quantity = 1;
    setIsModalOpen(true);
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
  };

  const closeModal = () => {
    setCartProduct([]);
    setIsModalOpen(false);
  };
  function deleteProductFromCart(id: number) {
    setCartProduct((prevCartProducts) =>
      prevCartProducts.filter((product) => product.id !== id)
    );
  }
  function changeInput(e: React.ChangeEvent<HTMLInputElement>) {
    setText(e.target.value);
  }
  function changeSelect(e: React.ChangeEvent<HTMLInputElement>) {
    setCategory(e.target.value);
  }
  return (
    <>
      <section style={{ width: "100vw", height: "100vh" }}>
        <div
          style={{
            padding: "1rem",
            border: "1px solid black",
          }}
        >
          header
        </div>
        {isPending ? (
          <span> loading ...</span>
        ) : error ? (
          <span>error + {error.message}</span>
        ) : data.length === 0 ? (
          <span>No data found</span>
        ) : (
          <div className="main_container">
            <div className="filter_container">
              <input
                type="text"
                value={text}
                onChange={(e) => changeInput(e)}
              />
              <select name="" id="" onChange={(e) => changeSelect(e)}>
                <option value="All">All</option>
                {categoryData?.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div className="card_container">
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
                  <div key={product.id} className="card">
                    <img src={product.image} alt={product.title} />
                    <div className="content_container">
                      <h5>{product.title}</h5>
                      <p>{product.title}</p>
                      <span>{product.category}</span>

                      <div className="pricing_container">
                        <span>{product.price}</span>
                        <span>
                          {product.rating.rate}({product.rating.count})
                        </span>
                      </div>
                      <button onClick={() => openModal(product)}>
                        Open Modal
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </section>

      <Modal show={isModalOpen} onClose={closeModal}>
        <h2>Modal Header</h2>
        <div className="productcontainer">
          {cartProduct.map((product) => (
            <div className="product">
              <p>
                {product.title} <br />
                {product.price} (Quant:{product.quantity})
              </p>

              <button onClick={() => deleteProductFromCart(product.id)}>
                Remove
              </button>
            </div>
          ))}
        </div>
      </Modal>
    </>
  );
};
export default Products;
