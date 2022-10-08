// Running scripts on a local node 12:17:58

const { ethers, getNamedAccounts } = require("hardhat")

async function main() {
    const { deployer } = await getNamedAccounts() // Get account referenced in hardhat-config
    const fundMe = await ethers.getContract("FundMe", deployer) // Get FundMe contract
    console.log("Funding....")
    const transactionResponse = await fundMe.withdraw() // Withdraw funds
    await transactionResponse.wait(1) // Wait 1 block confirmation
    console.log("Got it back")
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
