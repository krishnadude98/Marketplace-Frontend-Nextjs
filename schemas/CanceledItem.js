import { Schema, model, models } from "mongoose";
import mongoose from "mongoose";
var canceledItem = Schema(
  {
    seller: { type: String, required: true },
    nftAddress: { type: String, required: true },
    tokenId: { type: String, required: true },
  },
  { timestamps: true }
);

canceledItem.index({ seller: 1, nftAddress: 1, tokenId: 1 }, { unique: true });
var CanceledItem;

if (mongoose.models.CanceledItem) {
  CanceledItem = model("CanceledItem");
} else {
  CanceledItem = model("CanceledItem", canceledItem);
}
module.exports = CanceledItem;
