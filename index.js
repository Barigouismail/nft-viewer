const express = require('express');
const Web3 = require('web3');

const app = express();
const port = 3000;

// إعداد Web3 باستخدام مزود Infura أو Alchemy
const provider = 'https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID';
const web3 = new Web3(new Web3.providers.HttpProvider(provider));

// عنوان عقد ERC721 (NFT) للتعامل معه
const contractAddress = '0xYourNFTContractAddress';
const abi = [ /* ضع ABI الخاص بالعقد هنا */ ];
const nftContract = new web3.eth.Contract(abi, contractAddress);

// Route لفحص NFTs
app.get('/nfts/:walletAddress', async (req, res) => {
    const walletAddress = req.params.walletAddress;

    try {
        // استرداد عدد NFTs المملوكة من قبل المستخدم
        const balance = await nftContract.methods.balanceOf(walletAddress).call();

        let nfts = [];
        for (let i = 0; i < balance; i++) {
            const tokenId = await nftContract.methods.tokenOfOwnerByIndex(walletAddress, i).call();
            const tokenURI = await nftContract.methods.tokenURI(tokenId).call();
            nfts.push({ tokenId, tokenURI });
        }

        res.json({ walletAddress, nfts });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while fetching NFTs.' });
    }
});

// تشغيل الخادم
app.listen(port, () => {
    console.log(`NFT Viewer running at http://localhost:${port}`);
});