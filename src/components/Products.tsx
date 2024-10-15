import { useQuery } from "@tanstack/react-query";
import { ProductType } from "../type";
import "./product.css";
import { useState } from "react";
import React from "react";
const Products = () => {
  const [text, setText] = useState<string>("");
  const [category, setCategory] = useState<string>("All");
  const { isPending, error, data } = useQuery({
    queryKey: ["products"],
    queryFn: (): Promise<ProductType[]> =>
      fetch("https://fakestoreapi.com/products").then((res) => res.json()),
  });
  const {
    isPending: isPendingCategory,
    error: errorCategory,
    data: categoryData,
  } = useQuery({
    queryKey: ["productsCategory"],
    queryFn: (): Promise<string[]> =>
      fetch("https://fakestoreapi.com/products/categories").then((res) =>
        res.json()
      ),
  });

  function changeInput(e: React.ChangeEvent<HTMLInputElement>) {
    setText(e.target.value);
  }
  function changeSelect(e: React.ChangeEvent<HTMLInputElement>) {
    setCategory(e.target.value);
  }
  return (
    <React.Fragment>
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
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </section>
    </React.Fragment>
  );
};
export default Products;
