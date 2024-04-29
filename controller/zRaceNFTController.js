require('dotenv').config();
const ethers = require('ethers');
const API_URL_BLOCKCHAIN = process.env.API_URL_BLOCKCHAIN;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const contractAddress = process.env.CONTRACT_ADDRESS;
const provider = new ethers.JsonRpcProvider(API_URL_BLOCKCHAIN);
const CHAIN = process.env.CHAIN;
const signer = new ethers.Wallet(PRIVATE_KEY, provider);
const {abi} = require("../contract/ZNFTAbi.json");
const { Typed } = require('ethers');
const Moralis = require ('moralis').default;

const contractInstance = new ethers.Contract(contractAddress, abi, signer);

const getBalanceNFTOfAccount = async (req,res) =>{
    try{
        const account = req.body.account;
        console.log(account);
        const id = Typed.uint256(req.body.id)
        const nft = await contractInstance.balanceOf(Typed.address(account),id);
        const numOfID = Number(nft);
        res.status(200).json({data: numOfID})
    }
    catch(e)
    {
        console.error(e);
        res.status(500).json(e);
    }
} 
const postBuyNFTByZcoinToken = async(req,res)=>{
    try{
        const id = Typed.uint256(req.body.id);
        const token = Typed.uint256(BigInt(req.body.token) * BigInt(Math.pow(10,18)));
        const amount = Typed.uint256(req.body.amount)
        const address = Typed.address(req.body.senderAddress);
        const checkAmount = await contractInstance.getTokenBalance(address);
        const tokenHave = Number(checkAmount)/ Math.pow(10,18);
        if(tokenHave>=req.body.token)
        {
            const buyNFT = await contractInstance.BuyNFTByOwnToken(id,amount,token)
            res.status(200).json({data: "success", error: null});
        }
        else
            res.status(404).json({data: null, error: "Not enough coin"});

    }
    catch(e)
    {
        console.error(e);
        res.status(500).json({data: null,error: "Some thing went wrong"});
    }
}
const getAllNFTByAccount = async(req,res)=>{
    try{
        const address =req.body.address;

        const response = address && await Moralis.EvmApi.nft.getWalletNFTs({
            "chain": CHAIN,
            "format": "decimal",
            "tokenAddresses": [
              contractAddress
            ],
            "mediaItems": false,
            "address": address
          });
        res.status(200).json({data: response, error: null});
    }
    catch(e)
    {
        console.error(e);
        res.status(500).json({data: null,error: "Some thing went wrong"});
    }
}
module.exports = {getBalanceNFTOfAccount, postBuyNFTByZcoinToken, getAllNFTByAccount}
