/* eslint-disable react/prop-types */
import Axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { detailsProduct, updateProduct } from "../actions/productActions";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import { PRODUCT_UPDATE_RESET } from "../constants/productConstants";

export default function ProductEditScreen(props) {
  const productId = props.match.params.id;
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");


  const [category, setCategory] = useState("");



  const [countInStock, setCountInStock] = useState("");
  const [brand, setBrand] = useState("");
  const [description, setDescription] = useState("");
  //todo
  const [capacity, setCapacity] = useState("");
  const [countryOfOrigin, setCountryOfOrigin] = useState("");
  const [manufacturingRegion, setManufacturingRegion] = useState("");
  const [vintage, setVintage] = useState("");
  const [percent, setPercent] = useState("");


  const productDetails = useSelector((state) => state.productDetails);
  const { loading, error, product } = productDetails;

  const productUpdate = useSelector((state) => state.productUpdate);
  const {
    loading: loadingUpdate,
    error: errorUpdate,
    success: successUpdate,
  } = productUpdate;
  const dispatch = useDispatch();
  useEffect(() => {
    if (successUpdate) {
      props.history.push("/productlist");
    }
    if (!product || product._id !== productId || successUpdate) {
      dispatch({ type: PRODUCT_UPDATE_RESET });
      dispatch(detailsProduct(productId));
    } else {
      setName(product.name);
      setPrice(product.price);
      setImage(product.image);
      setCategory(product.category);
      setCountInStock(product.countInStock);
      setBrand(product.brand);
      setDescription(product.description);
      setCapacity(product.capacity);
      setCountryOfOrigin(product.countryOfOrigin);
      setManufacturingRegion(product.manufacturingRegion);
      setVintage(product.vintage);
      setPercent(product.percent);
    }
  }, [dispatch, product, productId, successUpdate, props.history]);
  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(
      updateProduct({
        _id: productId,
        name,
        price,
        image,
        category,
        brand,
        countInStock,
        description,
        capacity,
        countryOfOrigin,
        manufacturingRegion,
        vintage,
        percent,
      })
    );
  };
  const [loadingUpload, setLoadingUpload] = useState(false);
  const [errorUpload, setErrorUpload] = useState("");

  const userSignin = useSelector((state) => state.userSignin);
  const { userInfo } = userSignin;

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    const bodyFormData = new FormData();
    bodyFormData.append("image", file);
    setLoadingUpload(true);
    try {
      const { data } = await Axios.post("/api/uploads", bodyFormData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${userInfo.token}`,
        },
      });
      setImage(data);
      setLoadingUpload(false);
    } catch (error) {
      setErrorUpload(error.message);
      setLoadingUpload(false);
    }
  };
  return (
    <div>
      <form className="form" onSubmit={submitHandler}>
        <div>
          <h1>Edit Product {productId}</h1>
        </div>
        {loadingUpdate && <LoadingBox></LoadingBox>}
        {errorUpdate && <MessageBox variant="danger">{errorUpdate}</MessageBox>}
        {loading ? (
          <LoadingBox></LoadingBox>
        ) : error ? (
          <MessageBox variant="danger">{error}</MessageBox>
        ) : (
          <>
            <div>
              <label htmlFor="name">Name</label>
              <input
                id="name"
                type="text"
                placeholder="Enter name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              ></input>
            </div>
            <div>
              <label htmlFor="price">Price</label>
              <input
                id="price"
                type="text"
                placeholder="Enter price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              ></input>
            </div>
            <div>
              <label htmlFor="image">Image</label>
              <input
                id="image"
                type="text"
                placeholder="Enter image"
                value={image}
                onChange={(e) => setImage(e.target.value)}
              ></input>
              <div></div>
              <label htmlFor="imageFile">Image File</label>
              <input
                type="file"
                id="imageFile"
                label="Choose Image"
                onChange={uploadFileHandler}
              ></input>
              {loadingUpload && <LoadingBox></LoadingBox>}
              {errorUpload && (
                <MessageBox variant="danger">{errorUpload}</MessageBox>
              )}
            </div>
            <div>
            <label htmlFor="category">Category</label>
            <select
            onChange={(e)=> setCategory(e.target.value)}
            name="category"
            >
              <option value="red">red</option>
              <option value="white">white</option>
              <option value="pink">pink</option>
              <option value="dessert">dessert</option>
              <option value="sparkling">sparkling</option>
            </select>
            </div>
            <div>
              <label htmlFor="brand">Brand</label>
              <input
                id="brand"
                type="text"
                placeholder="Enter brand"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
              ></input>
            </div>
            <div>
              <label htmlFor="countInStock">Count In Stock</label>
              <input
                id="countInStock"
                type="text"
                placeholder="Enter Count In Stock"
                value={countInStock}
                onChange={(e) => setCountInStock(e.target.value)}
              ></input>
            </div>
            <div>
              <label htmlFor="capacity">capacity</label>
              <input
                id="capacity"
                type="text"
                placeholder="1000"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
              ></input>
            </div>
            <div>
              <label htmlFor="countryOfOrigin">countryOfOrigin</label>
              <input
                id="countryOfOrigin"
                type="text"
                placeholder="Blank"
                value={countryOfOrigin}
                onChange={(e) => setCountryOfOrigin(e.target.value)}
              ></input>
            </div>
            <div>
              <label htmlFor="manufacturingRegion">manufacturingRegion</label>
              <input
                id="manufacturingRegion"
                type="text"
                placeholder="Blank"
                value={manufacturingRegion}
                onChange={(e) => setManufacturingRegion(e.target.value)}
              ></input>
            </div>
            <div>
              <label htmlFor="vintage">vintage</label>
              <input
                id="vintage"
                type="text"
                placeholder="Blank"
                value={vintage}
                onChange={(e) => setVintage(e.target.value)}
              ></input>
            </div>
            <div>
              <label htmlFor="percent">percent</label>
              <input
                id="percent"
                type="text"
                placeholder="Blank"
                value={percent}
                onChange={(e) => setPercent(e.target.value)}
              ></input>
            </div>
            <div>
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                rows="3"
                type="text"
                placeholder="Enter description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
            </div>
            <div>
              <label></label>
              <button className="primary" type="submit">
                Update
              </button>
            </div>
          </>
        )}
      </form>
    </div>
  );
}
