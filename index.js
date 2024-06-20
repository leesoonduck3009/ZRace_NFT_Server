const express = require('express')
const app = express();
require('dotenv').config();
const Moralis = require ('moralis').default;
const port = process.env.PORT;
const zRaceController = require('./controller/listenerWallet');
const {firebaseApp, auth} = require("./config/firebaseConfig");
const email = process.env.EMAIL_LOGIN;
const password = process.env.PASSWORD;
const { signInWithEmailAndPassword, createUserWithEmailAndPassword } = require("firebase/auth");
app.use(express.json());

app.use('/api/wallet',require('./routes/walletRoute'));
app.use('/api/nft',require('./routes/zRaceNFTRoute'));
app.use('/api/shoes',require('./routes/shoesRoute'));

app.use((req, res, next) => {
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache');
    next();
  });
const login = async()=>{
  await signInWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    // Đăng nhập thành công
    console.log('User logged in: ');
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.error('Error: ', errorCode, errorMessage);
  });
}
 login();

zRaceController.onContractTransferStrideUpCoinListener();
const startServer = async () => {
    await Moralis.start({
      apiKey: process.env.API,
    });
  
    app.listen(port, () => {
      console.log(`Example app listening on port ${port}`);
    });
  };
  startServer();