// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const { ethers, upgrades } = require("hardhat")
const { writeFileSync } = require("fs")

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');
  ;[owner] = await ethers.getSigners()
  // // We get the contract to deploy
  const getcontract = await ethers.getContractFactory(
    "DepositAndWithdrawUpgradeBNB"
  )
  const contractMain = await upgrades.deployProxy(getcontract)
  await contractMain.deployTransaction.wait(1)

  const tokenContract = await ethers.getContractFactory("MockToken")
  const token = await tokenContract.deploy()
  await token.deployed()

  writeFileSync(
    "deployedBNBContract.json",
    JSON.stringify(
      {
        proxyContract: contractMain.address,
      },
      null,
      2
    )
  )
  console.log("contract token", contractMain.address)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })