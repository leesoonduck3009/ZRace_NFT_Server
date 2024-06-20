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
const {db} = require('../config/firebaseConfig.js');
const contractCoinInstance = new ethers.Contract( COIN_CONTRACT_ADDRESS, abiCoin.abi,  provider);
const contractCoinUserInstance = new ethers.Contract( COIN_CONTRACT_ADDRESS,abiCoin.abi,  signer);
const contractNFTInstance = new ethers.Contract( NFT_CONTRACT_ADDRESS, abiNFT.abi,signer);
const {doc, setDoc,addDoc , getDocs, collection, query,where,updateDoc} = require('firebase/firestore')
const {admin, firestore} = require("../config/firebaseAdminConfig");
const onContractTransferStrideUpCoinListener = () => {
    try {
        console.log("Run contract transferListener")
        contractCoinInstance.addListener('Transfer', async(from, to, amount, event) => {
            console.log("from: ", ethers.getAddress(from));
            console.log("to: ", ethers.getAddress(to));
            console.log("amount: ", ethers.formatEther(amount));
            const walletRef = collection(db, 'wallet');
            const addressTo = ethers.getAddress(to).toLowerCase();
            const newBalanceOfFromAccount = ethers.formatEther(await contractCoinUserInstance.balanceOf(ethers.getAddress(from)));
            const newBalanceOfToAccount = ethers.formatEther(await contractCoinUserInstance.balanceOf(ethers.getAddress(to)));
            console.log(newBalanceOfToAccount   )
            const querySnapshotFrom = await getDocs(query(walletRef,where("publicAddress","==",ethers.getAddress(from))));
            querySnapshotFrom.forEach(async (document) => {
                const idDoc = document.id;
                const walletRefFrom = doc(db,"wallet",idDoc);
                const data = document.data();
                await updateDoc(walletRefFrom, {
                    zCoin: parseFloat(newBalanceOfFromAccount,10)
                });
            });
            const querySnapshotTo = await getDocs(query(walletRef,where("publicAddress","==",addressTo)));
            querySnapshotTo.forEach(async (document) => {
                const idDoc = document.id;
                const walletRefTo = doc(db,"wallet",idDoc);
                const data = document.data();
                await updateDoc(walletRefTo, {
                    zCoin: parseFloat(newBalanceOfToAccount,10)
                });
            });
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