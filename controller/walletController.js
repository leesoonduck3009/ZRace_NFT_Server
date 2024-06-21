const Moralis = require ('moralis').default;
const asyncHandler = require('express-async-handler')
const {doc, setDoc,addDoc , getDocs, collection, query,where} = require('firebase/firestore')
const {db} = require('../config/firebaseConfig')
const abiCoin  = require("../contract/ZCoinAbi.json");
const {encrypt,decrypt} = require('../config/DataHash');
require('dotenv').config();
const ethers = require('ethers');
const admin = require("../config/firebaseAdminConfig");
const API_URL_BLOCKCHAIN = process.env.API_URL_BLOCKCHAIN;
const CHAIN = process.env.CHAIN;
const COIN_CONTRACT_ADDRESS = process.env.COIN_CONTRACT_ADDRESS;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const PUBLIC_KEY = process.env.PUBLIC_KEY;
const provider = new ethers.JsonRpcProvider(API_URL_BLOCKCHAIN);
const signer = new ethers.Wallet( PRIVATE_KEY, provider);
const contractCoinUserInstance = new ethers.Contract( COIN_CONTRACT_ADDRESS,abiCoin.abi,  signer);
const {firestore} =require("../config/firebaseAdminConfig")
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
const convertFromZcoinToCoin = async(req,res)=>{
    try{
        const data = req.body;
        const wallet = await firestore.collection("wallet").doc(data.userId).get();
        const walletData = wallet.data();
        const newBalanceOfFromAccount = ethers.formatEther(await contractCoinUserInstance.balanceOf(walletData.publicAddress));
        const balanceInt = parseFloat(newBalanceOfFromAccount);
        if(balanceInt>=data.zCoin){
            console.log(ethers.parseUnits(data.zCoin.toString(), 18));
            const user = await firestore.collection("users").doc(data.userId).get();
            const userData = user.data();
            await contractCoinUserInstance.transferByContract(walletData.publicAddress,PUBLIC_KEY,ethers.parseUnits(data.zCoin.toString(), 18));
            const coin = userData.coin + data.zCoin*10;
            await firestore.collection("users").doc(data.userId).update({coin: coin});
            res.status(200).json({data: "success"});
        }
        else{
            res.status(500).json({error: "not enough zCoin"});
        }
    }
    catch(e){
        console.log(e);
        res.sendStatus(500);
    }
}
const convertFromCoinToZcoin = async(req,res)=>{
    try{
        const data = req.body;
        const user = await firestore.collection("users").doc(data.userId).get();
        const userData = user.data();
        const wallet = await firestore.collection("wallet").doc(data.userId).get();
        const walletData = wallet.data();
        if(userData.coin>=data.coin){
            const coin = userData.coin - data.coin;
            const zCoin = coin/10;
            const balanceAccount = await contractCoinUserInstance.balanceOf(walletData.publicAddress);
            console.log(ethers.parseUnits(zCoin.toString(), 18));
            await contractCoinUserInstance.transferByContract(PUBLIC_KEY,walletData.publicAddress,ethers.parseUnits(zCoin.toString(), 18));
            await firestore.collection("users").doc(data.userId).update({coin: coin});
            res.status(200).json({data: "success"});
        }
        else{
            res.status(500).json({error: "not enough coin"});
        }
        
    }
    catch(e){
        console.log(e);
        res.sendStatus(500);
    }
}
module.exports = {getWalletBalance,createWallet, getWalletWithId,convertFromCoinToZcoin,convertFromZcoinToCoin}