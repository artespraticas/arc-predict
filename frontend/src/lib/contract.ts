// Arc Testnet configuration
export const ARC_TESTNET = {
  id: 5042002,
  name: "Arc Testnet",
  nativeCurrency: {
    decimals: 6,
    name: "USDC",
    symbol: "USDC",
  },
  rpcUrls: {
    default: { http: ["https://rpc.testnet.arc.network"] },
    public: { http: ["https://rpc.testnet.arc.network"] },
  },
  blockExplorers: {
    default: {
      name: "ArcScan",
      url: "https://testnet.arcscan.app",
    },
  },
  testnet: true,
};

// Replace with your deployed contract address after running deploy.js
export const CONTRACT_ADDRESS =
  process.env.NEXT_PUBLIC_CONTRACT_ADDRESS ||
  "0x0000000000000000000000000000000000000000";

// Arc testnet USDC address — update from Circle's official docs
export const USDC_ADDRESS =
  process.env.NEXT_PUBLIC_USDC_ADDRESS ||
  "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238";

export const ABI = [
  // Market management
  {
    inputs: [
      { name: "question", type: "string" },
      { name: "category", type: "string" },
      { name: "imageUrl", type: "string" },
      { name: "resolutionSource", type: "string" },
      { name: "deadline", type: "uint256" },
      { name: "resolutionDate", type: "uint256" },
      { name: "minBet", type: "uint256" },
    ],
    name: "createMarket",
    outputs: [{ name: "marketId", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { name: "marketId", type: "uint256" },
      { name: "isYes", type: "bool" },
      { name: "amount", type: "uint256" },
    ],
    name: "placeBet",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ name: "marketId", type: "uint256" }],
    name: "claimWinnings",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  // Views
  {
    inputs: [{ name: "marketId", type: "uint256" }],
    name: "getMarket",
    outputs: [
      {
        components: [
          { name: "id", type: "uint256" },
          { name: "question", type: "string" },
          { name: "category", type: "string" },
          { name: "imageUrl", type: "string" },
          { name: "deadline", type: "uint256" },
          { name: "resolutionDate", type: "uint256" },
          { name: "totalYes", type: "uint256" },
          { name: "totalNo", type: "uint256" },
          { name: "minBet", type: "uint256" },
          { name: "status", type: "uint8" },
          { name: "outcome", type: "uint8" },
          { name: "creator", type: "address" },
          { name: "resolutionSource", type: "string" },
        ],
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { name: "marketId", type: "uint256" },
      { name: "user", type: "address" },
    ],
    name: "getPosition",
    outputs: [
      {
        components: [
          { name: "yesAmount", type: "uint256" },
          { name: "noAmount", type: "uint256" },
          { name: "claimed", type: "bool" },
        ],
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "marketId", type: "uint256" }],
    name: "getYesProbability",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { name: "marketId", type: "uint256" },
      { name: "isYes", type: "bool" },
      { name: "amount", type: "uint256" },
    ],
    name: "estimatePayout",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "marketCount",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  // Events
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "marketId", type: "uint256" },
      { indexed: false, name: "question", type: "string" },
      { indexed: false, name: "category", type: "string" },
      { indexed: false, name: "deadline", type: "uint256" },
      { indexed: true, name: "creator", type: "address" },
    ],
    name: "MarketCreated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "marketId", type: "uint256" },
      { indexed: true, name: "bettor", type: "address" },
      { indexed: false, name: "isYes", type: "bool" },
      { indexed: false, name: "amount", type: "uint256" },
    ],
    name: "BetPlaced",
    type: "event",
  },
];

export const USDC_ABI = [
  {
    inputs: [
      { name: "spender", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    name: "approve",
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ name: "account", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { name: "owner", type: "address" },
      { name: "spender", type: "address" },
    ],
    name: "allowance",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
];

// Category config
export const CATEGORIES = [
  { id: "all", label: "All Markets", icon: "🌐" },
  { id: "Central Banks", label: "Central Banks", icon: "🏦" },
  { id: "FX", label: "FX / Forex", icon: "💱" },
  { id: "Crypto", label: "Crypto", icon: "₿" },
  { id: "Equities", label: "Equities", icon: "📈" },
  { id: "Macro", label: "Macro", icon: "🌍" },
];

// Demo markets for when contract is not deployed
export const DEMO_MARKETS = [
  {
    id: 0n,
    question: "Will the ECB cut interest rates at its June 2025 meeting?",
    category: "Central Banks",
    imageUrl: "",
    deadline: BigInt(Math.floor(Date.now() / 1000) + 7 * 86400),
    resolutionDate: BigInt(Math.floor(Date.now() / 1000) + 8 * 86400),
    totalYes: 48500n * 1000000n,
    totalNo: 31200n * 1000000n,
    minBet: 1000000n,
    status: 0,
    outcome: 0,
    creator: "0x0000000000000000000000000000000000000000",
    resolutionSource: "ECB official press release",
  },
  {
    id: 1n,
    question: "Will Bitcoin reach $120,000 before July 2025?",
    category: "Crypto",
    imageUrl: "",
    deadline: BigInt(Math.floor(Date.now() / 1000) + 14 * 86400),
    resolutionDate: BigInt(Math.floor(Date.now() / 1000) + 15 * 86400),
    totalYes: 125000n * 1000000n,
    totalNo: 89000n * 1000000n,
    minBet: 1000000n,
    status: 0,
    outcome: 0,
    creator: "0x0000000000000000000000000000000000000000",
    resolutionSource: "CoinGecko BTC/USD price feed",
  },
  {
    id: 2n,
    question: "Will EUR/USD be above 1.10 on June 30, 2025?",
    category: "FX",
    imageUrl: "",
    deadline: BigInt(Math.floor(Date.now() / 1000) + 21 * 86400),
    resolutionDate: BigInt(Math.floor(Date.now() / 1000) + 22 * 86400),
    totalYes: 22000n * 1000000n,
    totalNo: 18500n * 1000000n,
    minBet: 1000000n,
    status: 0,
    outcome: 0,
    creator: "0x0000000000000000000000000000000000000000",
    resolutionSource: "ECB reference exchange rate",
  },
  {
    id: 3n,
    question: "Will the Fed keep rates unchanged at its July 2025 meeting?",
    category: "Central Banks",
    imageUrl: "",
    deadline: BigInt(Math.floor(Date.now() / 1000) + 28 * 86400),
    resolutionDate: BigInt(Math.floor(Date.now() / 1000) + 29 * 86400),
    totalYes: 67000n * 1000000n,
    totalNo: 41000n * 1000000n,
    minBet: 1000000n,
    status: 0,
    outcome: 0,
    creator: "0x0000000000000000000000000000000000000000",
    resolutionSource: "Federal Reserve FOMC statement",
  },
  {
    id: 4n,
    question: "Will S&P 500 close above 5,500 on June 28, 2025?",
    category: "Equities",
    imageUrl: "",
    deadline: BigInt(Math.floor(Date.now() / 1000) + 35 * 86400),
    resolutionDate: BigInt(Math.floor(Date.now() / 1000) + 36 * 86400),
    totalYes: 31000n * 1000000n,
    totalNo: 29000n * 1000000n,
    minBet: 1000000n,
    status: 0,
    outcome: 0,
    creator: "0x0000000000000000000000000000000000000000",
    resolutionSource: "Bloomberg Markets data",
  },
];
