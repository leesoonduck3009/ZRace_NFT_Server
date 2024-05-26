const express = require('express');
const { getWalletBalance, createWallet,getWalletWithId } = require('../controller/walletController');
const router = express.Router();
router.route('/balance').post(getWalletBalance);
router.route('/create-wallet').post(createWallet);
router.route('/get-wallet-with-id').post(getWalletWithId);

module.exports=router
