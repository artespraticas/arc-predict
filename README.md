# 🔮 ArcPredict — Financial Prediction Markets on Arc

> Bet on economic events — ECB rates, FX, crypto — with instant USDC settlement on Arc's 1-second finality chain.

Built for the **Arc Testnet** by Circle. Uses USDC as the native settlement token with deterministic finality in under 1 second.

---

## 🚀 Live Demo

Deploy to Vercel in one click — see instructions below.

---

## 📁 Project Structure

```
arc-predict/
├── contracts/
│   └── ArcPredict.sol        # Main smart contract
├── scripts/
│   └── deploy.js             # Deployment + market seeding
├── frontend/
│   ├── src/
│   │   ├── app/              # Next.js App Router
│   │   ├── components/       # UI components
│   │   └── lib/              # Contract ABI, config, wagmi
│   └── package.json
├── hardhat.config.js
└── vercel.json
```

---

## 🔧 Setup & Deploy

### 1. Clone the repo

```bash
git clone https://github.com/YOUR_USERNAME/arc-predict.git
cd arc-predict
```

### 2. Install contract dependencies

```bash
npm install
```

### 3. Configure your wallet

Create a `.env` file in the root:

```env
PRIVATE_KEY=your_private_key_here
```

⚠️ Never commit your private key. Use a testnet-only wallet.

### 4. Get testnet USDC

- Go to [https://faucet.testnet.arc.network](https://faucet.testnet.arc.network)
- Request testnet USDC for your wallet address

### 5. Deploy to Arc Testnet

```bash
npm run deploy:arc
```

Copy the contract address from the output.

### 6. Set up frontend

```bash
cd frontend
cp .env.example .env.local
```

Edit `.env.local` and paste:
```env
NEXT_PUBLIC_CONTRACT_ADDRESS=0xYOUR_DEPLOYED_CONTRACT
NEXT_PUBLIC_USDC_ADDRESS=0xYOUR_USDC_ADDRESS
```

### 7. Run locally

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 🌐 Deploy to Vercel

1. Push to GitHub
2. Go to [vercel.com](https://vercel.com) → New Project → Import your repo
3. Add environment variables:
   - `NEXT_PUBLIC_CONTRACT_ADDRESS`
   - `NEXT_PUBLIC_USDC_ADDRESS`
4. Deploy!

---

## ⛓️ Arc Testnet Details

| Property | Value |
|---|---|
| Chain ID | `5042002` |
| RPC | `https://rpc.testnet.arc.network` |
| Gas Token | USDC (6 decimals) |
| Explorer | `https://testnet.arcscan.app` |
| Finality | < 1 second |

---

## 🔮 Smart Contract Features

- **Create markets** on any financial event
- **Bet YES/NO** with USDC
- **Automatic payout** distribution to winners
- **2% platform fee** (configurable)
- **Resolver role** for trusted outcome reporting
- **Market cancellation** with full refunds
- **Estimated payout** calculator on-chain

---

## 🛠️ Tech Stack

- **Smart Contract**: Solidity 0.8.20 + OpenZeppelin
- **Chain**: Arc Testnet (Circle)
- **Frontend**: Next.js 14 + TypeScript
- **Web3**: wagmi v2 + viem + RainbowKit
- **Styling**: Tailwind CSS + custom dark theme
- **Deployment**: Vercel

---

## 📄 License

MIT
