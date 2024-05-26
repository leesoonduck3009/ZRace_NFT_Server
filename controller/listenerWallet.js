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
const onContractTransferStrideUpCoinListener = () => {
    try {
        console.log("Run contract transferListener")
        contractCoinInstance.addListener('Transfer', async(from, to, amount, event) => {
            console.log("from: ", ethers.getAddress(from));
            console.log("to: ", ethers.getAddress(to));
            console.log("amount: ", ethers.formatEther(amount));
            const walletRef = collection(db, 'wallet');
            const querySnapshotFrom = await getDocs(query(walletRef,where("walletAddress","==",ethers.getAddress(from))));
            const newBalanceOfFromAccount = ethers.formatEther(await contractCoinUserInstance.balanceOf(from));
            const newBalanceOfToAccount = ethers.formatEther(await contractCoinUserInstance.balanceOf(to));
            querySnapshotFrom.forEach(async (document) => {
                const idDoc = document.id;
                const walletRefFrom = doc(db,"wallet",idDoc);
                const data = document.data();
                await updateDoc(walletRefFrom, {
                    balance: parseInt(newBalanceOfFromAccount,10)
                });
            });
            const querySnapshotTo = await getDocs(query(walletRef,where("walletAddress","==",ethers.getAddress(to))));
            querySnapshotTo.forEach(async (document) => {
                const idDoc = document.id;
                const walletRefTo = doc(db,"wallet",idDoc);
                const data = document.data();
                await updateDoc(walletRefTo, {
                    balance: parseInt(newBalanceOfToAccount,10)
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
module.exports = {onContractTransferStrideUpCoinListener};