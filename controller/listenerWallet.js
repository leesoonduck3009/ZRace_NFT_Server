require('dotenv').config();
const abiCoin  = require("../contract/ZCoinAbi.json");
const abiNFT = require('../contract/ZNFTAbi.json')
const ethers = require('ethers');
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const API_URL_BLOCKCHAIN = process.env.API_URL_BLOCKCHAIN;
const COIN_CONTRACT_ADDRESS = process.env.COIN_CONTRACT_ADDRESS;
const NFT_CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
const provider = new ethers.JsonRpcProvider(API_URL_BLOCKCHAIN);
const signer = new ethers.Wallet( PRIVATE_KEY, provider);
const contractCoinInstance = new ethers.Contract( COIN_CONTRACT_ADDRESS, abiCoin.abi,  provider);
const contractCoinUserInstance = new ethers.Contract( COIN_CONTRACT_ADDRESS,abiCoin.abi,  signer);
const contractNFTInstance = new ethers.Contract( NFT_CONTRACT_ADDRESS, abiNFT.abi,signer);
const {admin, firestore} = require("../config/firebaseAdminConfig");
const { collection, getFirestore, doc, query, where, getDocs, updateDoc } = require("firebase/firestore");
const onContractTransferStrideUpCoinListener = () => {
    try {
        console.log("Run contract transferListener")
        contractCoinInstance.addListener('Transfer', async(from, to, amount, event) => {
            console.log("from: ", ethers.getAddress(from));
            console.log("to: ", ethers.getAddress(to));
            console.log("amount: ", ethers.formatEther(amount));
            const walletRef = firestore.collection('wallet');
            const addressTo = ethers.getAddress(to).toLowerCase();
            const addressFrom = ethers.getAddress(from).toLowerCase();
            const newBalanceOfFromAccount = ethers.formatEther(await contractCoinUserInstance.balanceOf(ethers.getAddress(from)));
            const newBalanceOfToAccount = ethers.formatEther(await contractCoinUserInstance.balanceOf(ethers.getAddress(to)));
            console.log(newBalanceOfToAccount   )
            const responeTo = await walletRef.where("publicAddress","==", addressTo).get();
            if(responeTo.docs.length!=0){
                const dataTo = {zCoin: parseFloat(newBalanceOfToAccount)};
                await walletRef.doc(responeTo.docs[0].id).update(dataTo);
            }
            const responeFrom = await walletRef.where("publicAddress","==",addressFrom).get();
            if(responeFrom.docs.length!=0){
                const dataFrom = {zCoin: parseFloat(newBalanceOfFromAccount)};
                await walletRef.doc(responeFrom.docs[0].id).update(dataFrom);
            }
        });
    }
    catch (e) {
        console.log("error: ", e)
    }
}
const onContractTransferStrideUpNFTListener = async()=>{
    try{
        contractNFTInstance.addListener("TransferSingle",async (_operator,from,to,id,amount,event)=>{
            console.log("from: ", from);
            console.log("to: ", to);
            console.log("id: ", id);
            console.log("operation: ", operation);
            console.log("amount: ", amount);
            
        });
    }
    catch(e)
    {

    }
}
// const onContractTransfer = async()=>{
//     contractCoinInstance.addListener('Transfer', async(from, to, amount, event) => {
//         const addressFrom = ethers.getAddress(from)
//         const addressTo =  ethers.getAddress(to);
//         console.log("from: ", addressFrom);
//         console.log("to: ", addressTo);
//         console.log("amount: ", ethers.formatEther(amount));
//         const responeFrom = await firestore.collection("wallet").where("userId", "==", addressFrom ).get();
//         if(responeFrom.docs.length!==0)
//         {
//             const data = {"zCoin": }
//             await firestore.collection("wallet").doc(responeFrom.docs[0].id).set()
//         }
//     });
    
// }
module.exports = {onContractTransferStrideUpCoinListener};