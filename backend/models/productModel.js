import mongoose from "mongoose";
const reviewSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    comment: { type: String, required: true },
    rating: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);
const typeOfWine = {
  red: 'red',
  white: 'white',
  pink: 'pink',
  dessert: 'dessert',
  sparkling: 'sparkling'
}
const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    seller: { type: mongoose.Schema.Types.ObjectID, ref: "User" },
    image: { type: String, required: true },
    brand: { type: String, required: true },
    category: { type: typeOfWine, required: true }, //typeofWine
    description: { type: String, required: true },
    price: { type: Number, required: true },
    countInStock: { type: Number, required: true },
    rating: { type: Number, required: true },
    numReviews: { type: Number, required: true },

    capacity:{type: Number, require: true},//ml
    countryOfOrigin:{type: String, require: true},
    manufacturingRegion:{type: String, require: true},
    vintage:{type: Number,require:true },
    percent:{type: Number,require: true},//%

    reviews: [reviewSchema],
  },
  {
    timestamps: true,
  }
);
const Product = mongoose.model("Product", productSchema);

export default Product;
