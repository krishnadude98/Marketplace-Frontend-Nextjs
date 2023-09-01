// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const { Web3 } = require("web3");
const CancelItem = require("../../schemas/CanceledItem");
const ActiveItem = require("../../schemas/ActiveItem");
const ListItem = require("../../schemas/ListItem");
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
];

export default async function handler(req, res) {
  console.log(req.body);
  console.log(req.body.logs);
  const logData = req.body.logs[0]?.data;
  const logTopics = [
    req.body.logs[0]?.topic0,
    req.body.logs[0]?.topic1,
    req.body.logs[0]?.topic2,
    req.body.logs[0]?.topic3,
  ];
  const decodedLog = web3.eth.abi.decodeLog(abi, logData, logTopics);
  console.log(decodedLog);
  try {
    await connectMongo();
    const filter = {
      nftAddress: decodedLog["nftAddress"],
      tokenId: decodedLog["tokenId"],
    };
    const updated = { seller: decodedLog["seller"] };
    await CancelItem.findOneAndUpdate(filter, updated, {
      upsert: true,
    });
    await ActiveItem.findOne({
      seller: decodedLog["seller"],
      nftAddress: decodedLog["nftAddress"],
      tokenId: decodedLog["tokenId"],
    }).deleteMany();
    await ListItem.findOne({
      seller: decodedLog["seller"],
      nftAddress: decodedLog["nftAddress"],
      tokenId: decodedLog["tokenId"],
    }).deleteMany();
  } catch (e) {
    console.log(e);
  }
  res.status(200).send();
}
