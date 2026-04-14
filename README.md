# SafeRoute AI Guard for Onchain Execution

SafeRoute is an AI-powered execution guard that analyzes user intent before transactions are signed, flags risks in real time, and prevents unsafe actions from reaching the blockchain.

Instead of blindly signing transactions, users get clear feedback, risk scoring, and protection before funds move.

---

## Live App

https://xlayer-saferoute-agent.vercel.app/

---

## Overview

Onchain users regularly:
- approve unlimited token access
- interact with unknown contracts
- swap into unsafe or illiquid tokens

Most wallets only ask:
> “Do you want to sign this transaction?”

SafeRoute adds a decision layer before that step.

It evaluates what the user is trying to do, explains the risks, and either blocks or allows execution based on safety.

---

## ⚙️Core Features

- **Intent-based analysis**  
  Users describe what they want to do in plain text.

- **Risk scoring engine**  
  Classifies actions as Safe, Caution, or High Risk.

- **Transparent reasoning**  
  Explains why an action is risky or safe.

- **Execution control**  
  Blocks high-risk actions before reaching the wallet.

- **Real wallet integration**  
  Safe actions trigger a real MetaMask transaction request.

- **Onchain visibility**  
  Transactions can be viewed via block explorer.

---

## 🔐 How It Works

1. User inputs an action (e.g. swap, approval, transfer)  
2. SafeRoute analyzes the intent  
3. Risk level is assigned  
4. Explanation and safer suggestions are shown  
5. High-risk actions are blocked  
6. Safe actions proceed to wallet execution  

---

## 🧩 Tech Stack

- Next.js (App Router)
- React
- Tailwind CSS
- MetaMask / EVM wallet integration
- X Layer mainnet

---

## 🌐 Why X Layer

SafeRoute is built for real-time execution environments.

X Layer provides:
- fast transaction processing  
- low execution cost  
- smooth wallet interaction  

This makes it ideal for safety checks that happen just before transactions are signed.

---

## Getting Started

Clone the repository:

```bash
git clone https://github.com/ArmaniBanks/xlayer-saferoute-agent.git
cd xlayer-saferoute-agent
