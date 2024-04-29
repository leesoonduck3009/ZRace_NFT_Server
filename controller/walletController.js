const Moralis = require ('moralis').default;
const asyncHandler = require('express-async-handler')

const getWalletBalance = async (req,res)  => {
    try{

        const response = await Moralis.EvmApi.balance.getNativeBalance({
        "chain": "0x61",
        "address": req.body.address
        });
        console.log(response)
        const dataRespone = {
            address: req.body.address,
            balance: response.jsonResponse.balance
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