// routes/watchlist.routes.js
const express = require('express');
const router = express.Router();
const watchlist = require('../controller/watchlist.controller');

// some auth middleware that sets req.user (JWT etc)
const auth = require('../middleware/auth');

router.get('/wl', auth, watchlist.getWatchlist);
router.post('/al', auth, watchlist.addToWatchlist);
router.delete('/dl/:id', auth, watchlist.removeFromWatchlist);

module.exports = router;
