const mongoose = require("mongoose");

const holdingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    symbol: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    buyPrice: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Holding", holdingSchema);
