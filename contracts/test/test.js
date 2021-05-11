const Web3 = require('web3');

const LeSpaceToken = artifacts.require("LeSpaceToken");
const MarketContract = artifacts.require("MarketContract");
const Tukkis = artifacts.require("Tukkis");
const DiscoveryArtToken = artifacts.require("DiscoveryArtToken");

contract("Test", async (accounts) => {

    it("marketplace test", async () => {

        const testUri = "https://ipfs.io/ipfs/QmPqirRvGaMgZQBDiukf39zNQ7AW2YS5foH6J1tQxUYdkX";
        const askingPrice = Web3.utils.toWei("0.00001", "ether")
        const seller = accounts[0];
        console.log('seller',seller)
        const buyer = accounts[1];
        // const balanceOfSeller = 
        // const balanceOfBuyer = 

        const leSpace = await LeSpaceToken.deployed();
        const tukkis721 = await Tukkis.deployed();
        const discoveryArt = await DiscoveryArtToken.deployed();
        const marketplace = await MarketContract.deployed();

        const receipt = await tukkis721.createItem(testUri)
        const receipt2 = await tukkis721.createItem(testUri)

        console.log('result from receipt',receipt.receipt.logs[0].args)
        console.log('receipt.receipt.logs[0]',receipt.receipt.logs[0].args.tokenId.toString())

        //Balances of seller and buyer
        const EthBalanceOfSeller = await web3.eth.getBalance(seller)
        console.log('EthBalanceOfSeller = : ', EthBalanceOfSeller);
        const EthBalanceOfBuyer = await web3.eth.getBalance(buyer)
        console.log('EthBalanceOfBuyer = : ', EthBalanceOfBuyer);

        //Seller should have 2 nft
        const nftSeller = await tukkis721.ownerOf(1)
        console.log('NftSeller: ',nftSeller);
        const balanceOfSeller = await tukkis721.balanceOf(nftSeller);
        console.log('BalanceOfSeller: ',balanceOfSeller.toString())
        assert.equal(balanceOfSeller, 2, "less nft left than expected");
       // console.log('totalSupply',(await tukkis721.totalSupply()).toString())
    
        const tokenId = receipt.receipt.logs[0].args.tokenId.toString()
        const approvedAddress = await tukkis721.getApproved(tokenId)
        
        if (approvedAddress != marketplace.address){
            await tukkis721.approve(marketplace.address,tokenId,{from: accounts[0]});
            console.log('approved marketplace to sell tokenId ',tokenId)
        }
        console.log('tukkis721.address',tukkis721.address)
        console.log(askingPrice)
        const addToMarket = await marketplace.addItemToMarket(tokenId, tukkis721.address, askingPrice,{from: seller})         
        console.log("addedItem", addToMarket);

        const sellItem = await marketplace.buyItem(0, {
                from: buyer, //from the buyer 
                to: seller,
                gas: 4000000,
                value: askingPrice
         })
        
        console.log("soldItem", sellItem)

        //TODO assert if the buyer has less money before 
        //TODO assert if the seller has more money then before
        //TODO assert if the buyer has the nft
        //TODO assert if the seller has now one nft less

        //Buyer should have less money than before
        const newEthBalanceOfBuyer = await web3.eth.getBalance(buyer)
        console.log('newEthBalanceOfBuyer = : ', newEthBalanceOfBuyer);
        assert.isBelow(parseInt(newEthBalanceOfBuyer), parseInt(EthBalanceOfBuyer), "item not bought yet");

        //Seller should have more than before
        const newEthBalanceOfSeller = await web3.eth.getBalance(seller)
        console.log('newEthBalanceOfSeller = : ', newEthBalanceOfSeller);
        assert.equal(newEthBalanceOfSeller, (EthBalanceOfSeller+askingPrice*99/100), "item not sold yet");
        // assert.isAbove(parseInt(newEthBalanceOfSeller), parseInt(EthBalanceOfSeller), "item not sold yet");

        //Buyer should have now 1 nft
        const nftBuyer = await tukkis721.ownerOf(1)
        console.log('NftBuyer: ',nftBuyer);
        const balanceOfNftBuyer = await tukkis721.balanceOf(nftBuyer);
        console.log('BalanceOfNftBuyer: ',balanceOfNftBuyer.toString())
        assert.equal(balanceOfNftBuyer, 1, "no nft bought");

        //Seller should have 1 nft left
        const newBalanceOfSeller = await tukkis721.balanceOf(nftSeller);
        console.log('newBalanceOfSeller: ',newBalanceOfSeller.toString())
        assert.equal(newBalanceOfSeller, 1, "more nfts left than expected");

    })
})