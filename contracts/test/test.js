const Web3 = require('web3');

const LeSpaceToken = artifacts.require("LeSpaceToken");
const MarketContract = artifacts.require("MarketContract");
const Tukkis = artifacts.require("Tukkis");
const DiscoveryArtToken = artifacts.require("DiscoveryArtToken");

contract("Test", async (accounts) => {

    it("marketplace test", async () => {

        const testUri = "https://ipfs.io/ipfs/QmPqirRvGaMgZQBDiukf39zNQ7AW2YS5foH6J1tQxUYdkX";
        const askingPrice = Web3.utils.toWei("0.00001", "ether")
        const from = accounts[0];
        console.log('from',from)
        const to = accounts[1];
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
        //console.log('receipt.logs.args[0]',receipt.logs.args[0]) undefined.
       

        //console.log((await tukkis721.tokenByIndex(0)).toString())
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
        const addToMarket = await marketplace.addItemToMarket(tokenId, tukkis721.address, askingPrice,{from: from})         
        console.log("addedItem", addToMarket);

        const sellItem = await marketplace.buyItem(0, {
                from: to,
                to: from,
                gas: 4000000,
                value: askingPrice
         })
        
        console.log("soldItem", sellItem)

    })
})