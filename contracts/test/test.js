const Web3 = require('web3');

const LeSpaceToken = artifacts.require("LeSpaceToken");
const MarketContract = artifacts.require("MarketContract");
const Tukkis = artifacts.require("Tukkis");
const DiscoveryArtToken = artifacts.require("DiscoveryArtToken");

contract("Test", async (accounts) => {

    it("marketplace test", async () => {

        const testUri = "https://ipfs.io/ipfs/QmPqirRvGaMgZQBDiukf39zNQ7AW2YS5foH6J1tQxUYdkX"
        const askingPrice = Web3.utils.toWei("0.01", "ether").toString()
        const from = accounts[0]
        const to = accounts[1]
        // const balanceOfSeller = 
        // const balanceOfBuyer = 

        const leSpace = await LeSpaceToken.deployed();
        const tukkis721 = await Tukkis.deployed();
        const discoveryArt = await DiscoveryArtToken.deployed();
        const marketplace = await MarketContract.deployed();

        const mintToken = await tukkis721.createItem(testUri);
        console.log("minted", mintToken);

        const addToMarket = await marketplace.addItemToMarket(mintToken, tukkis721.address, askingPrice, {
            from: from,
            gas: 4000000
        })
        console.log("addedItem", addToMarket);

        const sellItem = await marketplace.buyItem(mintToken, {
                from: from,
                to: to,
                gas: 4000000,
                value: askingPrice
            })
        console.log("soldItem", sellItem);


    })
})