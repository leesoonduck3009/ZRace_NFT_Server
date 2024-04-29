const express = require('express');
const { getWalletBalance } = require('../controller/walletController');
const router = express.Router();
router.route('/balance').post(getWalletBalance);
module.exports=router
