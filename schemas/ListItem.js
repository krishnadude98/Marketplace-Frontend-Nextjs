import { Schema, model, models } from "mongoose";
import mongoose from "mongoose";
var listItem = Schema(
  {
    seller: { type: String, required: true },
    nftAddress: { type: String, required: true },
    tokenId: { type: String, required: true },
    price: { type: String, required: true },
  },
  { timestamps: true }
);

// var boughtItem = Schema({
//   buyer: { type: String, required: true },
//   nftAddress: { type: String, required: true },
//   tokenId: { type: Number, required: true },
//   price: { type: String, required: true },
// });

// var canceledItem = Schema({
//   seller: { type: String, required: true },
//   nftAddress: { type: String, required: true },
//   tokenId: { type: Number, required: true },
// });

var ListItem;
// var BoughtItem = model("boughtItem", boughtItem);
// var CanceledItem = model("canceledItem", canceledItem);

if (mongoose.models.ListItem) {
  ListItem = model("ListItem");
} else {
  ListItem = model("ListItem", listItem);
}

module.exports = ListItem;
