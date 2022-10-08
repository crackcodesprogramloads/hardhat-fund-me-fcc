// async function deployFunc(hre) {
//     console.log("Hi!")
// hre.getNamedAccounts()
// hre.deployments()
// }
// module.exports.default = deployFunc

// module.exports = async (hre) => {
//     const { getNamedAccounts, deployments } = hre

const { networkConfig, developmentChains } = require("../helper-hardhat-config") // Allows us to get price feed no matter the network
const { network } = require("hardhat")
const { verify } = require("../utils/verify")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId

    // const ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"] // Gets price feed from the network we are running
    let ethUsdPriceFeedAddress
    if (developmentChains.includes(network.name)) {
        // If chain has network name
        const ethUsdAggregator = await deployments.get("MockV3Aggregator") // Wait for retrieval of MockV3Aggregator
        ethUsdPriceFeedAddress = ethUsdAggregator.address // MockV3Aggregator address
    } else {
        ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"] // chainId priceFeed
    }

    // If the contract doesn't exist, we deploy a minimal version for our local testing
    // when going for localhost or hardhat network we want to use a mock

    const fundMe = await deploy("FundMe", {
        from: deployer,
        args: [ethUsdPriceFeedAddress], // price feed address
        log: true, // Gives us transaction and address once deployed
        // we need to wait if on a live network so we can verify properly
        waitConfirmations: network.config.blockConfirmations || 1, // will wait 6 blocks, if no blockConfirmations specified then wait 1
    })
    log(`FundMe deployed at ${fundMe.address}`)

    if (
        !developmentChains.includes(network.name) &&
        process.env.ETHERSCAN_API_KEY
    ) {
        await verify(fundMe.address, [ethUsdPriceFeedAddress])
    }

    log("----------------------------------------------------------")
}
module.exports.tags = ["all", "fundme"]
