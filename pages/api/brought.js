// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const { Web3 } = require("web3");
const BoughtItem = require("../../schemas/BroughtItem");
const ActiveItem = require("../../schemas/ActiveItem");
import connectMongo from "../../lib/mongoDb";
// Create a web3 instance
const web3 = new Web3(
  "https://eth-sepolia.g.alchemy.com/v2/GYMSL6Xa0fJWhAku74-2rMpGfRZFVKpi"
);
const abi = [
  {
    indexed: true,
    internalType: "address",
    name: "buyer",
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
  console.log(req.body.logs);
  await connectMongo();
  const logData = req.body.logs[0]?.data;
  const logTopics = [
    req.body.logs[0]?.topic0,
    req.body.logs[0]?.topic1,
    req.body.logs[0]?.topic2,
    req.body.logs[0]?.topic3,
  ];
  const decodedLog = web3.eth.abi.decodeLog(abi, logData, logTopics);
  console.log(decodedLog);
  var boughtItem = new BoughtItem({
    buyer: decodedLog["buyer"],
    nftAddress: decodedLog["nftAddress"],
    tokenId: decodedLog["tokenId"],
    price: decodedLog["price"],
  });
  await boughtItem.save();
  await ActiveItem.findOne({
    nftAddress: decodedLog["nftAddress"],
    tokenId: decodedLog["tokenId"],
  }).deleteMany();

  res.status(200).send();
}
