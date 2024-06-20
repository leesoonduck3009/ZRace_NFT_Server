const Moralis = require ('moralis').default;
const asyncHandler = require('express-async-handler')
const {doc, setDoc,addDoc , getDocs, collection, query,where} = require('firebase/firestore')
const {db} = require('../config/firebaseConfig')
const {encrypt,decrypt} = require('../config/DataHash');
require('dotenv').config();
const ethers = require('ethers');
const admin = require("../config/firebaseAdminConfig");
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
const createWallet = async (req, res) => {
    try{
        const privateKey = encrypt(req.body.privateKey);
        const walletAddress = req.body.walletAddress;
        const userId = req.body.userId;
        const response = await Moralis.EvmApi.token.getWalletTokenBalances({
            "chain": "0x61",
            "tokenAddresses": [
                COIN_CONTRACT_ADDRESS
            ],
            "address": walletAddress
          });
        const balance = response.jsonResponse[0].balance;
        const data = {
            privateKey: privateKey,
            userId: userId,
            balance: parseInt(ethers.formatEther(balance),10),
        }
        const fbRespone = await addDoc(collection(db,'wallet'), data);
        res.status(200).json({data: fbRespone.id, error: null});
    }
    catch(e)
    {
        res.status(500).json({data: null, error: e});
    }
}
const getWalletWithId = async(req,res)=>{
    try{
        const walletAddress = req.body.walletAddress;
        const userId = req.body.userId;
        const querySnapshot = await getDocs(query(collection(db,'wallet'),where("walletAddress","==",walletAddress)
    ,where("userId","==",userId)));
    const data = querySnapshot.docs[0].data();
    const respone = {
        address: data.walletAddress,
        balance: data.balance
    }
    
        res.status(200).json({data: respone, error: null});
    }
    catch(e)
    {
        res.status(500).json({data: null, error: e});
    }
}
const transferMoneyWithId = async(req,res)=>{
    
}
module.exports = {getWalletBalance,createWallet, getWalletWithId}