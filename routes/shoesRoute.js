const express = require('express');
const {addShoes} = require("../controller/shoesController");
const router = express.Router();
router.route('/').post(addShoes);
module.exports = router;
