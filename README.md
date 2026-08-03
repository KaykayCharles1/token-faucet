**Bash Token Faucet**

A full-stack Web3 application featuring a cryptocurrency token, a faucet to claim BASH tokens on Base Sepolia, and a dashboard frontend powered by Next.js, integrated seamlessly with secure smart contracts built using Solidity and Foundry.



**Tech Stack**

Frontend: Next.js, React, Tailwind CSS

Web3 Integration: Wagmi, Viem, WalletConnect

Smart Contracts: Solidity, Foundry (Forge)

Libraries: OpenZeppelin Contracts



**Getting Started**

**Prerequisites**

Node.js (v18+ recommended)

Foundry (Forge)

1. Smart Contract Setup (Foundry)

cd contracts

forge build

forge test

2. Frontend Setup (Next.js)

cd ../app

npm install

npm run dev

Open [http://localhost:3000] with your browser to see the result.



**Security & Environment Variables**

This project utilizes a strict .gitignore configuration to ensure private keys, RPC URLs, and local broadcast data never leak to GitHub. To run locally, ensure you set up your own .env files based on standard configuration requirements.



Built by Kaykay
