import express from "express";
import expressAsyncHandler from "express-async-handler";
import data from "../data.js";
import Product from "../models/productModel.js";
import User from "../models/userModel.js";
import {isAdmin, isAuth, isSellerOrAdmin } from "../utils.js";
import { createRequire } from 'module';



const productRouter = express.Router();
const require = createRequire(import.meta.url);
const nodemailer = require("nodemailer");


async function send(user ,product) {
  let testAccount = await nodemailer.createTestAccount();

  let transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user, 
      pass: testAccount.pass, 
    },
  });

  let info = await transporter.sendMail({
    from: "Winolandia <projektwino2021@wp.pl>", 
    to: user.email, 
    subject: "New product is avalible in my store", // Subject line
    text: `Hello, look for new itam in my store :\n name: ${product.name} \n Brand : ${product.brand}
     \n capcity : ${product.capacity} \n price: ${product.price}`, // plain text body
  
  });

  console.log("Message sent: %s", info.messageId);
 

  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  
}





productRouter.get(
  "/",
  expressAsyncHandler(async (req, res) => {
    const pageSize = 3;
    const page = Number(req.query.pageNumber) || 1;
    const name = req.query.name || "";
    const category = req.query.category || "";
    const seller = req.query.seller || "";
    const order = req.query.order || "";

    const capacity =req.query.capacity;
    const brand =req.query.brand || "";
    console.log(capacity);

    const min =
      req.query.min && Number(req.query.min) !== 0 ? Number(req.query.min) : 0;
    const max =
      req.query.max && Number(req.query.max) !== 0 ? Number(req.query.max) : 0;
    const rating =
      req.query.rating && Number(req.query.rating) !== 0
        ? Number(req.query.rating)
        : 0;
    const nameFilter = name ? { name: { $regex: name, $options: "i" } } : {};
    const sellerFilter = seller ? { seller } : {};
    const categoryFilter = category ? { category } : {};
    const priceFilter = min && max ? { price: { $gte: min, $lte: max } } : {};

    const capacityFilter = capacity !== "0" ? {capacity} : {capacity:{ $gte: 0, $lte: 2500}};
    console.log(capacityFilter);
    
    const brandFilter =brand ? {  brand: { $regex: brand, $options: "i" }}: {};

    const percentFilter = min && max ? { percent: { $gte: min, $lte: max } } : {};
    const vintageFilter = min && max ? { vintage: { $gte: min, $lte: max } } : {};

    const ratingFilter = rating ? { rating: { $gte: rating } } : {};
    const sortOrder =
      order === "lowest"
        ? { price: 1 }
        : order === "highest"
        ? { price: -1 }
        : order === "toprated"
        ? { rating: -1 }
        : { _id: -1 };
    const count = await Product.count({
      ...sellerFilter,
      ...nameFilter,
      ...categoryFilter,
      ...priceFilter,
      ...ratingFilter,
      ...capacityFilter,
      ...brandFilter,

    });
    const products = await Product.find({
      ...sellerFilter,
      ...nameFilter,
      ...categoryFilter,
      ...priceFilter,
      ...ratingFilter,
      ...capacityFilter,
      ...brandFilter,

    })
      .populate("seller", "seller.name seller.logo")
      .sort(sortOrder) //({}) - it means return all products
      .skip(pageSize * (page - 1))
      .limit(pageSize);
    res.send({ products, page, pages: Math.ceil(count / pageSize) });
  })
);

productRouter.get(
  "/seed",
  expressAsyncHandler(async (req, res) => {
    // await User.remove({});
    const seller = await User.findOne({ isSeller: true });
    if (seller) {
      const prodcuts = data.product.map((product) => ({
        ...product,
        seller: seller._id,
      }));
      const createdProducts = await Product.insertMany(data.products);
      res.send({ createdProducts });
    } else {
      res
        .status(500)
        .send({ message: "No seller found first run /api/users/seed" });
    }
  })
);

productRouter.get(
  "/:id",
  expressAsyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id).populate(
      "seller",
      "seller.name seller.logo seller.rating seller.numReviews"
    );
    if (product) {
      res.send(product);
    } else {
      res.status(404).send({ message: "Product Not Found" });
    }
  })
);
const typeOfWine = {
  red: 'red',
  white: 'white',
  pink: 'pink',
  dessert: 'dessert',
  sparkling: 'sparkling'
}

productRouter.post(
  "/",
  isAuth,
  isSellerOrAdmin,
  expressAsyncHandler(async (req, res) => {
    const product = new Product({
      name: "sample name " + Date.now(),
      seller: req.user._id,
      image: "/uploads\\new1.jpg",
      price: 0,
      category: typeOfWine.red,
      brand: "sample brand",
      countInStock: 0,
      rating: 0,
      numReviews: 0,
      description: "sample description",

      capacity: 1000,
      countryOfOrigin: "Blank",
      manufacturingRegion: "Blank",
      vintage: 2021,
      percent: 0,

    });
    const createdProduct = await  product.save();
    

    
    res.send({ message: "Product Created", product: createdProduct });
  })
  );

productRouter.put(
  "/:id",
  isAuth,
  isSellerOrAdmin,
  expressAsyncHandler(async (req, res) => {
    const productId = req.params.id;
    const product = await Product.findById(productId);
    if (product) {
      product.name = req.body.name;
      product.price = req.body.price;
      product.image = req.body.image;
      product.category = req.body.category;
      product.brand = req.body.brand;
      product.countInStock = req.body.countInStock;
      product.description = req.body.description;

      product.capacity = req.body.capacity;
      product.countryOfOrigin = req.body.countryOfOrigin;
      product.manufacturingRegion = req.body.manufacturingRegion;
      product.vintage = req.body.vintage;
      product.percent = req.body.percent;

      const updatedProduct = await product.save();


      const users = await  User.find();
      users.map((user) =>{
      console.log(user.email);
      send(user, product);
      });
      res.send({ message: "Product Updated", product: updatedProduct });
    } else {
      res.status(404).send({ message: "Product Not Found" });
    }
  })
);

productRouter.delete(
  "/:id",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (product) {
      const deleteProduct = await product.remove();
      res.send({ message: "Product Deleted", product: deleteProduct });
    } else {
      res.status(404).send({ message: "Product Not Found" });
    }
  })
);

productRouter.get(
  "/categories/:_id",
  expressAsyncHandler(async (req, res) => {
    const categories = await Product.find().distinct("category");
    res.send(categories);
  })
);

productRouter.post(
  "/:id/reviews",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const productId = req.params.id;
    const product = await Product.findById(productId);
    if (product) {
      if (product.reviews.find((x) => x.name === req.user.name)) {
        return res
          .status(400)
          .send({ message: "You already submitted a review" });
      }
      const review = {
        name: req.user.name,
        rating: Number(req.body.rating),
        comment: req.body.comment,
      };
      product.reviews.push(review);
      product.numReviews = product.reviews.length;
      product.rating =
        product.reviews.reduce((a, c) => c.rating + a, 0) /
        product.reviews.length;
      const updatedProduct = await product.save();
      res.status(201).send({
        message: "Review Created",
        review: updatedProduct.reviews[updatedProduct.reviews.length - 1],
      });
    } else {
      res.status(404).send({ message: "Product Not Found" });
    }
  })
);

export default productRouter;
