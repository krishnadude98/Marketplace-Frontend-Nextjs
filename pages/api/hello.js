// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const { Web3 } = require("web3");
const ListItem = require("../../schemas/ListItem");
const ActiveItem = require("../../schemas/ActiveItem");
import { filter } from "mongodb/lib/core/connection/logger";
import connectMongo from "../../lib/mongoDb";

// Create a web3 instance
const web3 = new Web3(
  "https://eth-sepolia.g.alchemy.com/v2/GYMSL6Xa0fJWhAku74-2rMpGfRZFVKpi"
);
const abi = [
  {
    indexed: true,
    internalType: "address",
    name: "seller",
    type: "address",
  },
  {
    indexed: true,
    internalType: "address",
    name: "nftAddress",
    type: "address",
  },
  {
    indexed: true,
    internalType: "uint256",
    name: "tokenId",
    type: "uint256",
  },
  {
    indexed: false,
    internalType: "uint256",
    name: "price",
    type: "uint256",
  },
];

export default async function handler(req, res) {
  if (req.body.logs.length > 0) {
    await connectMongo();
    const logData = req.body.logs[0]?.data;
    const logTopics = [
      req.body.logs[0]?.topic0,
      req.body.logs[0]?.topic1,
      req.body.logs[0]?.topic2,
      req.body.logs[0]?.topic3,
    ];
    const decodedLog = web3.eth.abi.decodeLog(abi, logData, logTopics);
    const filter = {
      nftAddress: decodedLog["nftAddress"],
      tokenId: decodedLog["tokenId"],
    };
    let updated = { price: decodedLog["price"], seller: decodedLog["seller"] };
    let updateResult;
    try {
      updateResult = await ActiveItem.findOneAndUpdate(filter, updated, {
        new: true,
      });
    } catch (e) {
      console.log("not found");
    }
    const isUpdateRequest = !!updateResult;
    console.log("ISUPDATED", isUpdateRequest);
    if (!isUpdateRequest) {
      console.log("SHOULD BE HERE");
      var listedItem = new ListItem({
        seller: decodedLog["seller"],
        nftAddress: decodedLog["nftAddress"],
        tokenId: decodedLog["tokenId"],
        price: decodedLog["price"],
      });
      var activeItem = new ActiveItem({
        seller: decodedLog["seller"],
        nftAddress: decodedLog["nftAddress"],
        tokenId: decodedLog["tokenId"],
        price: decodedLog["price"],
      });
      try {
        await listedItem.save();
        await activeItem.save();
      } catch (e) {
        console.log(e);
      }
      console.log(decodedLog);

      res.status(200).send();
    } else {
      res.status(200).send();
    }
  } else {
    res.status(404).send();
  }
}

// export default async function handler(req, res) {
//   console.log("hi");
//   await connectMongo();
//   const data = {
//     nftAddress: "0x268E7547Fa20283C74540212441B75df607d355b",
//     tokenId: "35",
//   };

//   try {
//     const result = await ListItem.findOne({ ...data });
//     console.log("result", result);
//   } catch (e) {
//     console.log(e);
//   }
//   console.log(decodedLog);

//   res.status(200).send();
// }
