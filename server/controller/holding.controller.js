const Holding = require("../database/schema/Holding.model");

// GET all holdings
const getHoldings = async (req, res) => {
  try {
    const holdings = await Holding.find({ userId: req.user._id });
    res.json(holdings);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch holdings" });
  }
};

// ADD holding
const addHolding = async (req, res) => {
  try {
    const { symbol, quantity, buyPrice } = req.body;

    const holding = await Holding.create({
      userId: req.user._id,
      symbol,
      quantity,
      buyPrice,
    });

    res.status(201).json(holding);
  } catch (err) {
    res.status(500).json({ message: "Failed to add holding" });
  }
};

// DELETE holding
const deleteHolding = async (req, res) => {
  try {
    const { id } = req.params;
    await Holding.findOneAndDelete({ _id: id, userId: req.user._id });
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete holding" });
  }
};
module.exports={getHoldings,addHolding,deleteHolding}