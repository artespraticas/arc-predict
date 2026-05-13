require("dotenv").config();
const { ethers } = require("hardhat");

// Arc Testnet USDC address (Circle's official testnet USDC)
const USDC_ADDRESS = "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238";

async function main() {
  // Check private key exists before anything else
  if (!process.env.PRIVATE_KEY) {
    console.error("\n❌ ERROR: PRIVATE_KEY not found!");
    console.error("   Create a .env file in the arc-predict folder with:");
    console.error("   PRIVATE_KEY=0x_a_tua_chave_privada\n");
    process.exit(1);
  }

  const signers = await ethers.getSigners();
  if (!signers || signers.length === 0) {
    console.error("\n❌ ERROR: No signers found. Check your PRIVATE_KEY in .env\n");
    process.exit(1);
  }

  const deployer = signers[0];
  console.log("✅ Deploying with account:", deployer.address);

  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("   Balance:", ethers.formatUnits(balance, 6), "USDC");

  // Deploy contract
  const ArcPredict = await ethers.getContractFactory("ArcPredict");
  const arcPredict = await ArcPredict.deploy(USDC_ADDRESS);
  await arcPredict.waitForDeployment();

  const address = await arcPredict.getAddress();
  console.log("✅ ArcPredict deployed to:", address);
  console.log("   Explorer: https://testnet.arcscan.app/address/" + address);

  // Seed initial markets
  console.log("\nCreating sample markets...");

  const now = Math.floor(Date.now() / 1000);
  const oneDay = 86400;
  const oneWeek = 7 * oneDay;

  const markets = [
    {
      question: "Will the ECB cut interest rates at its June 2025 meeting?",
      category: "Central Banks",
      imageUrl: "",
      resolutionSource: "ECB official press release (ecb.europa.eu)",
      deadline: now + oneWeek,
      resolutionDate: now + oneWeek + oneDay,
      minBet: ethers.parseUnits("1", 6), // 1 USDC
    },
    {
      question: "Will Bitcoin reach $120,000 before July 2025?",
      category: "Crypto",
      imageUrl: "",
      resolutionSource: "CoinGecko BTC/USD price feed",
      deadline: now + 2 * oneWeek,
      resolutionDate: now + 2 * oneWeek + oneDay,
      minBet: ethers.parseUnits("1", 6),
    },
    {
      question: "Will EUR/USD be above 1.10 on June 30, 2025?",
      category: "FX",
      imageUrl: "",
      resolutionSource: "ECB reference exchange rate",
      deadline: now + 3 * oneWeek,
      resolutionDate: now + 3 * oneWeek + oneDay,
      minBet: ethers.parseUnits("1", 6),
    },
    {
      question: "Will the Fed keep rates unchanged at its July 2025 meeting?",
      category: "Central Banks",
      imageUrl: "",
      resolutionSource: "Federal Reserve FOMC statement (federalreserve.gov)",
      deadline: now + 4 * oneWeek,
      resolutionDate: now + 4 * oneWeek + oneDay,
      minBet: ethers.parseUnits("1", 6),
    },
  ];

  for (const market of markets) {
    const tx = await arcPredict.createMarket(
      market.question,
      market.category,
      market.imageUrl,
      market.resolutionSource,
      market.deadline,
      market.resolutionDate,
      market.minBet
    );
    await tx.wait();
    console.log(`  ✓ "${market.question.slice(0, 50)}..."`);
  }

  console.log("\n✅ All done! Update your frontend .env:");
  console.log(`NEXT_PUBLIC_CONTRACT_ADDRESS=${address}`);
  console.log(`NEXT_PUBLIC_USDC_ADDRESS=${USDC_ADDRESS}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
