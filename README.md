# LandLedger

LandLedger is a decentralized application (dApp) for managing farmland assets and investments on the Aptos blockchain. Users can create farms, view farm listings, and invest in farms using their Petra wallet.

## Features

- Connect/disconnect with Petra wallet
- Create new farm assets
- View all farms and their details
- Invest in available farms
- Responsive, modern UI with mobile support

## Tech Stack

- React + TypeScript
- Vite
- Tailwind CSS
- Aptos SDK
- Move smart contracts

## Getting Started

### Prerequisites

- Node.js (v16+)
- npm or yarn
- Petra wallet browser extension

### Installation

```bash
git clone https://github.com/<your-username>/landledger.git
cd landledger
npm install
```

### Running the App

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Smart Contracts

Move contracts are located in the `contract/` directory. See `contract/sources/` for source files.

To compile, test, or publish contracts, use the scripts in `scripts/move/`.

## Folder Structure

```
frontend/         # React frontend
contract/         # Move smart contracts
scripts/move/     # Scripts for contract management
public/           # Static assets
```
