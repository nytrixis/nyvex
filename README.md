# Nyvex - Decentralized Startup Funding & P2P Lending Platform

A blockchain-powered platform for startup fundraising with NFT-based investment certificates and peer-to-peer lending on Avalanche.

**Live Demo:** [https://nyvex-warp.vercel.app](https://nyvex-warp.vercel.app)

## Deployed Contract

| Network | Address | Explorer |
|---------|---------|----------|
| Avalanche Fuji Testnet | `0xC6a6E3c2a50B296C3E61E90b8cE26Ea5CC8AEC2A` | [View on Snowtrace](https://43113.testnet.snowtrace.io/address/0xC6a6E3c2a50B296C3E61E90b8cE26Ea5CC8AEC2A) |

---

## What It Does

Nyvex solves the problem of centralized startup funding by creating a trustless, transparent investment ecosystem:

- **Startup Fundraising**: Entrepreneurs create campaigns with funding goals, deadlines, and equity structures
- **NFT Investment Certificates**: Every investment mints an ERC721 NFT proving ownership stake
- **Milestone-Based Fund Release**: Funds are released incrementally as verified milestones are completed
- **P2P Lending**: Users can request and fund loans with automated interest distribution
- **IPFS Document Storage**: Business plans and legal documents stored immutably on IPFS
- **Refund Protection**: Automatic refunds if funding targets aren't met

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              USER INTERFACE                                  │
│                           (Next.js 14 + React 18)                           │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │
│  │  Startups   │  │    Loans    │  │  Portfolio  │  │  Create Campaign    │ │
│  │   Browser   │  │   Browser   │  │  (NFT View) │  │  / Request Loan     │ │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘  └──────────┬──────────┘ │
│         └────────────────┴────────────────┴─────────────────────┘           │
│                                    │                                         │
│                        ┌───────────▼───────────┐                            │
│                        │   Context Provider    │                            │
│                        │   (State Management)  │                            │
│                        └───────────┬───────────┘                            │
└────────────────────────────────────┼────────────────────────────────────────┘
                                     │
                 ┌───────────────────┼───────────────────┐
                 │                   │                   │
                 ▼                   ▼                   ▼
┌────────────────────────┐  ┌───────────────┐  ┌────────────────────────────┐
│      THIRDWEB SDK      │  │  IPFS LAYER   │  │       ETHERS.js            │
│  • Wallet Connection   │  │   (Pinata)    │  │  • Contract Interaction    │
│  • Contract Calls      │  │               │  │  • Transaction Signing     │
│  • Account Management  │  │  • Documents  │  │  • Event Listening         │
└───────────┬────────────┘  │  • Metadata   │  └────────────┬───────────────┘
            │               │  • Proofs     │               │
            │               └───────┬───────┘               │
            │                       │                       │
            └───────────────────────┼───────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                    AVALANCHE FUJI TESTNET (Chain ID: 43113)                 │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │                    StartupFunding.sol (ERC721)                        │  │
│  │                                                                       │  │
│  │  ┌─────────────────┐    ┌─────────────────┐    ┌──────────────────┐  │  │
│  │  │    STARTUPS     │    │     LOANS       │    │   NFT MINTING    │  │  │
│  │  │                 │    │                 │    │                  │  │  │
│  │  │ • Create        │    │ • Request       │    │ • Investment     │  │  │
│  │  │ • Fund          │    │ • Fund          │    │   Certificates   │  │  │
│  │  │ • Verify        │    │ • Withdraw      │    │ • On-chain       │  │  │
│  │  │ • Withdraw      │    │ • Repay (10%)   │    │   Metadata       │  │  │
│  │  │ • Refund        │    │                 │    │ • Equity %       │  │  │
│  │  └─────────────────┘    └─────────────────┘    └──────────────────┘  │  │
│  │                                                                       │  │
│  │  ┌─────────────────┐    ┌─────────────────┐                          │  │
│  │  │   MILESTONES    │    │   DOCUMENTS     │                          │  │
│  │  │                 │    │                 │                          │  │
│  │  │ • Create        │    │ • IPFS Hash     │                          │  │
│  │  │ • Complete      │    │   Storage       │                          │  │
│  │  │ • Fund Release  │    │ • Type Tagging  │                          │  │
│  │  └─────────────────┘    └─────────────────┘                          │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                              │
│  Contract: 0xC6a6E3c2a50B296C3E61E90b8cE26Ea5CC8AEC2A                       │
└──────────────────────────────────────────────────────────────────────────────┘
```

### Data Flow

```
INVESTOR FLOW                          STARTUP CREATOR FLOW
─────────────────                      ───────────────────────
     │                                        │
     ▼                                        ▼
┌──────────┐                           ┌─────────────────┐
│ Connect  │                           │ Create Campaign │
│ Wallet   │                           │ + Equity Setup  │
└────┬─────┘                           └────────┬────────┘
     │                                          │
     ▼                                          ▼
┌──────────┐                           ┌─────────────────┐
│ Browse   │                           │ Upload Docs     │
│ Startups │                           │ to IPFS         │
└────┬─────┘                           └────────┬────────┘
     │                                          │
     ▼                                          ▼
┌──────────┐    NFT Minted             ┌─────────────────┐
│  Fund    │ ─────────────────────────▶│ Receive Funds   │
│ Startup  │    (Investment Proof)     │ on Milestones   │
└────┬─────┘                           └────────┬────────┘
     │                                          │
     ▼                                          ▼
┌──────────┐                           ┌─────────────────┐
│ Portfolio│                           │ Complete        │
│ NFT View │                           │ Milestones      │
└──────────┘                           └─────────────────┘
```

---

## Tech Stack

### Blockchain Layer
| Technology | Purpose |
|------------|---------|
| **Solidity ^0.8.9** | Smart contract development |
| **OpenZeppelin** | ERC721URIStorage, secure contract patterns |
| **Hardhat** | Development, testing, deployment |
| **Avalanche Fuji** | Testnet deployment (Chain ID: 43113) |

### Frontend Layer
| Technology | Purpose |
|------------|---------|
| **Next.js 14** | React framework (App Router) |
| **TypeScript** | Type-safe development |
| **Thirdweb SDK v5** | Wallet connection & contract interaction |
| **Ethers.js v6** | Blockchain transactions |
| **Tailwind CSS** | Styling |
| **Framer Motion** | Animations |
| **shadcn/ui** | UI components |

### Storage Layer
| Technology | Purpose |
|------------|---------|
| **IPFS (Pinata)** | Decentralized document storage |
| **On-chain Metadata** | NFT attributes stored directly on blockchain |

---

## Smart Contract Overview

### Core Data Structures

```solidity
struct Startup {
    address owner;
    string title;
    string description;
    EquityHolder[] equityHolders;  // Equity distribution
    uint256 target;                 // Funding goal
    uint256 deadline;
    uint256 amountCollected;
    Funder[] funders;              // Investor list
    Document[] documentHashes;      // IPFS references
    Milestone[] milestones;         // Funding milestones
    bool isVerified;
}

struct LoanRequest {
    address requester;
    uint256 amount;
    uint256 duration;
    uint256 amountCollected;
    Funder[] lenders;
    bool repaid;                    // 10% interest on repayment
}
```

### Key Functions

| Function | Description |
|----------|-------------|
| `createStartup()` | Launch a new funding campaign |
| `fundStartup()` | Invest in startup (mints NFT certificate) |
| `verifyStartup()` | Verifier marks startup as legitimate |
| `completeMilestone()` | Release funds for completed milestone |
| `requestLoan()` | Create a loan request |
| `fundLoan()` | Lend to a loan request |
| `repayLoan()` | Repay loan with 10% interest |
| `refundInvestment()` | Refund if target not met (burns NFT) |

---

## Project Structure

```
nyvex/
├── nyvexsc/                          # Smart Contracts
│   ├── contracts/
│   │   ├── StartupFunding.sol        # Main ERC721 contract
│   │   └── utils/Base64.sol          # On-chain metadata encoding
│   ├── scripts/deploy.js
│   └── hardhat.config.js
│
├── Nyvex/                            # Frontend Application
│   ├── src/
│   │   ├── app/
│   │   │   ├── startups/             # Startup pages
│   │   │   ├── loans/                # Loan pages
│   │   │   ├── portfolio/            # NFT portfolio view
│   │   │   └── page.tsx              # Landing page
│   │   ├── context/index.tsx         # Global state & contract calls
│   │   ├── services/ipfs.ts          # IPFS upload functions
│   │   └── components/
│   │       ├── MilestoneTracker.tsx
│   │       ├── DocumentManager.tsx
│   │       ├── NFTCard.tsx
│   │       └── EquityChart.tsx
│   └── package.json
│
└── README.md
```

---

## Getting Started

### Prerequisites

- Node.js >= 18
- MetaMask wallet
- Avalanche Fuji testnet AVAX ([Faucet](https://faucet.avax.network/))

### Installation

```bash
# Clone repository
git clone https://github.com/nytrixis/nyvex.git
cd nyvex

# Install frontend dependencies
cd Nyvex
npm install

# Create environment file
cp .env.example .env.local
```

### Environment Variables

```bash
# .env.local
NEXT_PUBLIC_TEMPLATE_CLIENT_ID=your_thirdweb_client_id
NEXT_PUBLIC_CONTRACT_ADDRESS=0xC6a6E3c2a50B296C3E61E90b8cE26Ea5CC8AEC2A
NEXT_PUBLIC_PINATA_JWT=your_pinata_jwt
NEXT_PUBLIC_PINATA_API_KEY=your_pinata_api_key
NEXT_PUBLIC_PINATA_API_SECRET=your_pinata_api_secret
```

### Run Development Server

```bash
cd Nyvex
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Deploy Contracts (Optional)

```bash
cd nyvexsc
npm install
npx hardhat compile
npx thirdweb deploy
```

---

## Key Features

### 1. Investment NFTs
Each investment mints a unique ERC721 token containing:
- Investment amount
- Calculated equity percentage
- Timestamp
- Startup reference

### 2. Milestone-Based Funding
- Define milestones with specific fund amounts
- Funds released only after verification
- IPFS proof of completion required

### 3. Refund Protection
- Automatic refunds if deadline passes without meeting target
- NFTs burned upon refund

### 4. P2P Lending
- Fixed 10% interest rate
- Multiple lenders per loan
- Proportional interest distribution

---

## Screenshots

| Landing Page | Startup Details | Portfolio |
|--------------|-----------------|-----------|
| Browse campaigns, platform stats | Investment form, milestones, documents | NFT certificates, equity breakdown |

---

## Security Considerations

- Verifier role controls milestone completion
- Funds locked until milestones verified
- IPFS ensures document immutability
- Refund mechanism protects investors

---

## Future Roadmap

- [ ] Mainnet deployment
- [ ] KYC integration
- [ ] Multi-sig verification
- [ ] Secondary NFT marketplace
- [ ] Mobile application

---

## License

MIT

---

## Contact

For questions or collaboration, reach out via GitHub issues.
