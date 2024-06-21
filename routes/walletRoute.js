const express = require('express');
const { getWalletBalance, createWallet,getWalletWithId, convertFromCoinToZcoin,convertFromZcoinToCoin } = require('../controller/walletController');
const router = express.Router();
router.route('/balance').post(getWalletBalance);
router.route('/create-wallet').post(createWallet);
router.route('/get-wallet-with-id').post(getWalletWithId);
router.route('/transfer-to-zcoin').post(convertFromCoinToZcoin);
router.route('/transfer-from-zcoin').post(convertFromZcoinToCoin);

module.exports=router
