const express = require('express')
const app = express();
require('dotenv').config();
const Moralis = require ('moralis').default;
const port = process.env.PORT;
app.use(express.json());

app.use('/api/wallet',require('./routes/walletRoute'));
app.use('/api/nft',require('./routes/zRaceNFTRoute'));

app.use((req, res, next) => {
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache');
    next();
  });
const startServer = async () => {
    await Moralis.start({
      apiKey: process.env.API,
    });
  
    app.listen(port, () => {
      console.log(`Example app listening on port ${port}`);
    });
  };
  startServer();