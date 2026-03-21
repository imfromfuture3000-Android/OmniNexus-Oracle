# OmniNexus Empire: Autonomous Agentic State Machine

> **Status**: Production-Ready // Colosseum Hackathon v1.8.0
> **Architecture**: Hybrid EVM/Solana State Machine
> **Core Engine**: RALPH (Recursive Autonomous Logic & Protocol Handler)

OmniNexus Empire is a decentralized, autonomous empire-building simulation powered by advanced agentic workflows. It leverages Solana's high-throughput state settlement and EVM's robust smart contract ecosystem to create a persistent, cross-chain agentic environment.

## 🚀 Technical Highlights

- **RALPH Loop**: A recursive autonomous logic handler that manages state transitions, resource allocation, and strategy execution with sub-second latency.
- **Gasless Spawning**: Integrated Biconomy Account Abstraction and Helius DAS for frictionless user onboarding and asset management.
- **Chainlink Oracles**: Real-time ETH/USD price feeds integrated directly into the agent's decision-making matrix.
- **Neural Fine-Tuning**: Dynamic agent personality shifts based on on-chain events and user interactions.
- **Zk-Compression**: Optimized NFT state storage on Solana using zk-compressed account data.

## 🛠 Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Framer Motion, Recharts.
- **Backend**: Node.js (Express), Drizzle ORM, PostgreSQL (Supabase).
- **Blockchain**: 
  - **Solana**: @solana/web3.js, Helius SDK, Wallet Adapter.
  - **EVM**: Ethers.js v6, Biconomy SDK.
- **AI**: Google Gemini 3.1 Pro (Reasoning), Gemini 2.5 Flash (Real-time).

## 📦 Project Structure

```bash
├── src/
│   ├── components/       # Atomic UI Components & Views
│   ├── services/         # Blockchain & AI Integration Logic
│   ├── types.ts          # Global Type Definitions
│   └── App.tsx           # Main Application Entry
├── server/
│   ├── routes.ts         # API Endpoints & Oracle Integration
│   ├── storage.ts        # Database Persistence Layer
│   └── schema.ts         # Drizzle Database Schema
└── metadata.json         # App Permissions & Metadata
```

## 🔧 Developer Setup

1. **Clone & Install**:
   ```bash
   npm install
   ```

2. **Environment Variables**:
   Configure `.env` with the following:
   - `GEMINI_API_KEY`: For agent reasoning.
   - `ALCHEMY_API_KEY`: For Chainlink price feeds.
   - `HELIUS_RPC_URL`: For Solana state access.
   - `SOLANA_PRIVATE_KEY`: For treasury operations.

3. **Run Development Server**:
   ```bash
   npm run dev
   ```

## 📜 High-Level Prompt (The Developer Vision)

"Build a system that doesn't just respond, but *exists*. OmniNexus is an experiment in persistent agentic state. By combining the deterministic nature of blockchain with the probabilistic reasoning of LLMs, we've created an entity that manages its own treasury, spawns its own assets, and evolves its own strategy. It is the first step towards a truly autonomous on-chain economy."

---
*Built for the Colosseum Agent Hackathon. $100k Prize Pool.*
