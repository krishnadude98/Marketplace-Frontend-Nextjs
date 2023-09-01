import { Schema, model, models } from "mongoose";
import mongoose from "mongoose";
var activeItem = Schema(
  {
    seller: { type: String, required: true },
    nftAddress: { type: String, required: true },
    tokenId: { type: String, required: true },
    price: { type: String, required: true },
  },
  { timestamps: true }
);
activeItem.index({ buyer: 1, nftAddress: 1, tokenId: 1 }, { unique: true });
var ActiveItem;
if (mongoose.models.ActiveItem) {
  ActiveItem = model("ActiveItem");
} else {
  ActiveItem = model("ActiveItem", activeItem);
}
module.exports = ActiveItem;
