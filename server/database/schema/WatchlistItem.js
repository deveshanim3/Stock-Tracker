// models/WatchlistItem.js
const mongoose = require('mongoose');

const watchlistItemSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',   // or whatever your user model is called
      required: true,
    },
    symbol: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    displaySymbol: {
      type: String,
    },
    currency: {
      type: String,
    },
  },
  { timestamps: true }
);

// One symbol per user only (optional but recommended)
watchlistItemSchema.index({ userId: 1, symbol: 1 }, { unique: true });

module.exports = mongoose.model('WatchlistItem', watchlistItemSchema);
