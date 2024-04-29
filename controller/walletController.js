const Moralis = require ('moralis').default;
const asyncHandler = require('express-async-handler')
require('dotenv').config();
const CHAIN = process.env.CHAIN;
const COIN_CONTRACT_ADDRESS = process.env.COIN_CONTRACT_ADDRESS;
const getWalletBalance = async (req,res)  => {
    try{

        const response = await Moralis.EvmApi.token.getWalletTokenBalances({
            "chain": "0x61",
            "tokenAddresses": [
                COIN_CONTRACT_ADDRESS
            ],
            "address": req.body.address
          });
        console.log(response)
        const dataRespone = {
            address: req.body.address,
            balance: response.jsonResponse[0].balance
        }
        res.status(200).json({data: dataRespone});
    }
    catch(e)
    {
        console.log("error: ", e)
        return res.status(500).json({
            data: null,
            error: "Server error"
        });
    }

}
module.exports = {getWalletBalance}