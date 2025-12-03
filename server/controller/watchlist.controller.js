// controllers/watchlist.controller.js
const WatchlistItem = require('../database/schema/WatchlistItem');

// GET /api/watchlist
const getWatchlist = async (req, res) => {
  try {
    const userId = req.user._id; 
    const items = await WatchlistItem.find({ userId }).sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    console.error('Get watchlist error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// POST /api/watchlist
const addToWatchlist = async (req, res) => {
  try {
    const userId = req.user._id;
    const { symbol, description, displaySymbol, currency } = req.body;

    if (!symbol) {
      return res.status(400).json({ message: 'Symbol is required' });
    }

    const item = await WatchlistItem.findOneAndUpdate(
      { userId, symbol },
      { symbol, description, displaySymbol, currency, userId },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.status(201).json(item);
  } catch (err) {
    console.error('Add watchlist error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// DELETE /api/watchlist/:id
const removeFromWatchlist = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;

    const deleted = await WatchlistItem.findOneAndDelete({
      _id: id,
      userId,
    });

    if (!deleted) {
      return res.status(404).json({ message: 'Item not found' });
    }

    res.json({ message: 'Removed from watchlist', id });
  } catch (err) {
    console.error('Delete watchlist error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
module.exports={getWatchlist,addToWatchlist,removeFromWatchlist}