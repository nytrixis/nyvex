// For Hardhat v2
const hre = require("hardhat");

async function main() {
  // Get the contract factory
  const StartupFunding = await hre.ethers.getContractFactory("StartupFunding");
  
  // Deploy the contract
  console.log("Deploying StartupFunding...");
  const startupFunding = await StartupFunding.deploy();
  
  // Wait for deployment to finish
  console.log("Waiting for deployment...");
  await startupFunding.deployed();
  
  // Log the contract address
  console.log("StartupFunding deployed to:", startupFunding.address);
}

// Execute the deployment
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
