# SafeRoute AI Guard for Onchain Execution

SafeRoute is an AI-powered safety layer that sits between user intent and blockchain execution on X Layer.

Today, users sign transactions blindly.

SafeRoute analyzes what a user is about to do before they sign, flags risks, explains why, and prevents unsafe actions from being executed.

---

## Live Demo

🔗 https://xlayer-saferoute-agent.vercel.app/

---

## What SafeRoute Does

- Accepts user intent in plain English  
- Classifies actions as Safe / Caution / High Risk  
- Explains the reasoning behind each decision  
- Blocks unsafe transactions at the UI level  
- Allows safer transactions to proceed  
- Triggers real wallet-based execution on X Layer  

---

## Architecture Overview

SafeRoute is built as a frontend AI-agent interface connected to onchain execution:

1. User enters an intent (e.g. “Swap 5 USDT to ETH”)
2. The analyzer evaluates the intent using rule-based logic
3. A risk level is assigned:
   - Safe
   - Caution
   - High Risk
4. UI enforces execution control:
   - High Risk → blocked
   - Safe → allowed
5. If allowed, the app triggers a real wallet transaction using:
   - `window.ethereum`
   - `eth_sendTransaction`

---

## 🔗 X Layer Integration

SafeRoute is deployed and operates on **X Layer Mainnet**.

- Wallet connection is handled via MetaMask / injected providers  
- Transactions are executed directly on X Layer using standard EVM calls  
- The application uses the connected wallet as the **execution identity**

This ensures:
- Real onchain interaction (not simulation)
- Compatibility with X Layer’s low-cost, fast execution environment

---

## Agentic Wallet Design

SafeRoute uses the connected wallet as its **agentic execution layer**.

- The user wallet acts as the onchain identity  
- The “agent” (SafeRoute) sits between user intent and execution  
- It evaluates decisions before allowing the wallet to sign  

This creates a simple but effective **intent → validation → execution** flow.

---

## ⚙️ Onchain OS / Uniswap Skill Usage

SafeRoute does not directly integrate external Onchain OS or Uniswap modules.

Instead, it focuses on:

- Pre-execution intelligence  
- Transaction safety analysis  
- Routing decisions based on intent  

The swap-related flows are simulated at the intent level, while execution is handled through standard wallet transactions.

---

## ⚡ Working Mechanism

SafeRoute introduces a new interaction model:

Instead of:
> “Do you want to sign this transaction?”

It becomes:
> “Is this transaction safe to execute?”

Flow:

1. User describes action  
2. AI layer evaluates risk  
3. User sees explanation  
4. Unsafe actions are blocked  
5. Safe actions can be executed  

---

## 📍 Positioning in X Layer Ecosystem

SafeRoute acts as a **security and intelligence layer** for X Layer users.

It can sit on top of:
- DEXs  
- Bridges  
- Wallets  
- Any onchain interaction  

Its goal is to reduce:
- Blind signing  
- Scam approvals  
- Risky swaps  

---

## 🧪 Deployment

- Network: X Layer Mainnet  
- Frontend: Next.js  
- Deployment: Vercel  
- Repo: https://github.com/ArmaniBanks/xlayer-saferoute-agent  

---

## 👤 Team

Built by:
- Armani Banks (@Armanibanks100)

---

## One Line

SafeRoute is an AI layer that prevents unsafe transactions before they happen by analyzing intent before execution.
