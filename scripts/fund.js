// Running scripts on a local node 12:17:58

const { ethers, getNamedAccounts } = require("hardhat")

async function main() {
    const { deployer } = await getNamedAccounts() // Get account referenced in hardhat-config
    const fundMe = await ethers.getContract("FundMe", deployer) // Get FundMe contract
    console.log("Funding Contract....")
    const transactionResponse = await fundMe.fund({
        // Wait for funds 0.01 ETH
        value: ethers.utils.parseEther("0.03"),
    })
    await transactionResponse.wait(1) // Wait 1 block confirmation
    console.log("Funded")
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
