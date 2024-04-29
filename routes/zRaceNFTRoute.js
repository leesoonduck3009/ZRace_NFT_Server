const express = require('express');
const router = express.Router();
const {getBalanceNFTOfAccount, postBuyNFTByZcoinToken, getAllNFTByAccount}  = require('../controller/zRaceNFTController.js')
router.route('/balance').post(getBalanceNFTOfAccount);
router.route('/buy-nft').post(postBuyNFTByZcoinToken);
router.route("/get-nft").post(getAllNFTByAccount);
module.exports = router;