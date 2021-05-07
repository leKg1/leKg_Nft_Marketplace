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

        const ownerOfNFT = await tukkis721.ownerOf(1)
        console.log('owner',ownerOfNFT);
        const balanceOfOwner = await tukkis721.balanceOf(ownerOfNFT);
        console.log('owner',balanceOfOwner.toString())
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

    })
})