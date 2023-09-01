import { Schema, model, models } from "mongoose";
import mongoose from "mongoose";
var boughtItem = Schema(
  {
    buyer: { type: String, required: true },
    nftAddress: { type: String, required: true },
    tokenId: { type: String, required: true },
    price: { type: String, required: true },
  },
  { timestamps: true }
);
boughtItem.index({ buyer: 1, nftAddress: 1, tokenId: 1 }, { unique: true });
var BoughtItem;
if (mongoose.models.BoughtItem) {
  BoughtItem = model("BoughtItem");
} else {
  BoughtItem = model("BoughtItem", boughtItem);
}
module.exports = BoughtItem;
