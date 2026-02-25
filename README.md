## Frontend Live: [https://web3wallet.projects.shubhamjha.me/wallet](https://web3wallet.projects.shubhamjha.me/wallet)
## Frontend Repo: [https://github.com/Shubham04Jha/web3wallet](https://github.com/Shubham04Jha/web3wallet)
# web3wallet-backend

A Next.js headless API backend that serves blockchain data (balances, transactions, etc.) for the web3wallet frontend. Abstracts away direct Alchemy RPC calls behind clean, validated REST endpoints.

🚀 **Live API:** [https://web3wallet-backend.vercel.app](https://web3wallet-backend.vercel.app)

---

## Table of Contents

- [Route Overview](#route-overview)
- [Common Conventions](#common-conventions)
- [Routes](#routes)
  - [GET /api Health Check](#health-check)
  - [POST /api/ethereum/getBalance](#ethereum-getbalance)
  - [POST /api/solana/getBalance](#solana-getbalance)
- [Running Locally](#running-locally)

---

## Route Overview

| Method | Path                        | Description                              |
|--------|-----------------------------|------------------------------------------|
| `GET`  | `/api`                      | Health check — returns `Hello world!`    |
| `POST` | `/api/ethereum/getBalance`  | Fetch ETH balance for a wallet address   |
| `POST` | `/api/solana/getBalance`    | Fetch SOL balance for a wallet address   |

---

## Common Conventions

### Request Headers
All `POST` routes require:
```
Content-Type: application/json
```

### `chainType` Field
Both balance endpoints accept an optional `chainType` field in the request body:

| Value    | Network           |
|----------|-------------------|
| `"main"` | Mainnet (default) |
| `"test"` | Testnet           |

### Error Shape
All error responses follow this shape:
```json
{ "error": "Description of what went wrong" }
```

| Status | Meaning                              |
|--------|--------------------------------------|
| `400`  | Validation error (bad request body)  |
| `415`  | Missing or wrong `Content-Type`      |
| `5xx`  | Upstream Alchemy error or server error |

---

## Routes

---

### GET `/api` — Health Check

A simple liveness check. No request body needed.

**Response**
```json
{ "message": "Hello world!" }
```

---

### POST `/api/ethereum/getBalance`

Fetches the ETH balance of a given wallet address by calling the Alchemy `eth_getBalance` RPC method.

**Request Body**
```json
{
  "address": "0xYourEthereumAddress",
  "chainType": "main"
}
```

| Field       | Type     | Required | Default  | Description                    |
|-------------|----------|----------|----------|--------------------------------|
| `address`   | `string` | ✅ Yes   | —        | Ethereum wallet address        |
| `chainType` | `string` | ❌ No    | `"main"` | `"main"` or `"test"`           |

**Success Response** `200`
```json
{
  "value": "0x38D7EA4C68000",
  "unit": "wei"
}
```

> ⚠️ `value` is a **hex string** (e.g. `"0x38D7EA4C68000"`) — this is what Alchemy's `eth_getBalance` natively returns. Use `BigInt` to parse it safely (see [frontend examples](#ethereum-getbalance-examples)).

**Error Response** `400`
```json
{
  "error": [{ "message": "ChainType not supported", ... }]
}
```

#### <a id="ethereum-getbalance-examples"></a>Ethereum getBalance Examples

<details>
<summary><strong>TypeScript</strong></summary>

```ts
type GetBalanceResponse = {
  value: string | null;
  unit: "wei";
};

async function getEthBalance(address: string, chainType: "main" | "test" = "main") {
  const res = await fetch("https://web3wallet-backend.vercel.app/api/ethereum/getBalance", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ address, chainType }),
  });

  if (!res.ok) {
    const { error } = await res.json();
    throw new Error(error);
  }

  const data: GetBalanceResponse = await res.json();

  if (data.value === null) return null;

  // Convert hex wei → ETH (as a display string)
  const wei = BigInt(data.value);
  const eth = Number(wei) / 1e18;

  return `${eth.toFixed(6)} ETH`;
}

// Usage
const balance = await getEthBalance("0xYourAddress");
console.log(balance); // "0.001000 ETH"
```

</details>

<details>
<summary><strong>JavaScript</strong></summary>

```js
async function getEthBalance(address, chainType = "main") {
  const res = await fetch("https://web3wallet-backend.vercel.app/api/ethereum/getBalance", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ address, chainType }),
  });

  if (!res.ok) {
    const { error } = await res.json();
    throw new Error(error);
  }

  const data = await res.json();

  if (data.value === null) return null;

  // Convert hex wei → ETH
  const wei = BigInt(data.value);
  const eth = Number(wei) / 1e18;

  return `${eth.toFixed(6)} ETH`;
}

// Usage
const balance = await getEthBalance("0xYourAddress");
console.log(balance); // "0.001000 ETH"
```

</details>

---

### POST `/api/solana/getBalance`

Fetches the SOL balance of a given wallet address by calling the Alchemy `getBalance` Solana RPC method.

**Request Body**
```json
{
  "address": "YourSolanaWalletAddress",
  "chainType": "main"
}
```

| Field       | Type     | Required | Default  | Description                    |
|-------------|----------|----------|----------|--------------------------------|
| `address`   | `string` | ✅ Yes   | —        | Solana wallet address (Base58) |
| `chainType` | `string` | ❌ No    | `"main"` | `"main"` or `"test"`           |

**Success Response** `200`
```json
{
  "value": "1000000",
  "unit": "lamports"
}
```

> ℹ️ `value` is a **numeric string** representing the balance in **lamports**. 1 SOL = 1,000,000,000 lamports (see [frontend examples](#solana-getbalance-examples)).

**Error Response** `400`
```json
{
  "error": [{ "message": "ChainType not supported", ... }]
}
```

#### <a id="solana-getbalance-examples"></a>Solana getBalance Examples

<details>
<summary><strong>TypeScript</strong></summary>

```ts
type GetBalanceResponse = {
  value: string | null;
  unit: "lamports";
};

async function getSolBalance(address: string, chainType: "main" | "test" = "main") {
  const res = await fetch("https://web3wallet-backend.vercel.app/api/solana/getBalance", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ address, chainType }),
  });

  if (!res.ok) {
    const { error } = await res.json();
    throw new Error(error);
  }

  const data: GetBalanceResponse = await res.json();

  if (data.value === null) return null;

  // Convert lamports → SOL
  const sol = Number(data.value) / 1e9;

  return `${sol.toFixed(6)} SOL`;
}

// Usage
const balance = await getSolBalance("YourSolanaAddress");
console.log(balance); // "0.001000 SOL"
```

</details>

<details>
<summary><strong>JavaScript</strong></summary>

```js
async function getSolBalance(address, chainType = "main") {
  const res = await fetch("https://web3wallet-backend.vercel.app/api/solana/getBalance", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ address, chainType }),
  });

  if (!res.ok) {
    const { error } = await res.json();
    throw new Error(error);
  }

  const data = await res.json();

  if (data.value === null) return null;

  // Convert lamports → SOL
  const sol = Number(data.value) / 1e9;

  return `${sol.toFixed(6)} SOL`;
}

// Usage
const balance = await getSolBalance("YourSolanaAddress");
console.log(balance); // "0.001000 SOL"
```

</details>

---

## Running Locally

```bash
pnpm install
pnpm run dev
```

Server starts at `http://localhost:3000`.

Make sure you have a `.env.local` file with:
```
ALCHEMY_API_KEY=your_alchemy_api_key_here
```
