const BoughtItem = require("../../schemas/BroughtItem");
import connectMongo from "../../lib/mongoDb";

export default async function handler(req, res) {
  await connectMongo();
  try {
    let data = await BoughtItem.find({});
    res.status(200).json({ data });
  } catch (e) {
    res.status(404).send({ error: e });
  }
}
