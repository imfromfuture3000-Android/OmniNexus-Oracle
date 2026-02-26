import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { getBalance, getTreasuryBalance, getNetworkStatus, getRecentTransactions, TREASURY_WALLET, HELIUS_URL } from "./solana";
import { omegaPrime } from "./omega-prime";
import { zeroCostRelayer } from "./zero-cost-relayer";
import { ralphAgent } from "./ralph-agent";
import { empireSpawner } from "./empire-spawner";
import { ethers } from "ethers";
import axios from "axios";
import { insertAlienSignalSchema, alien_signals } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  signals: {
    list: {
      method: 'GET' as const,
      path: '/api/signals',
      responses: {
        200: z.array(z.custom<typeof alien_signals.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/signals',
      input: insertAlienSignalSchema,
      responses: {
        201: z.custom<typeof alien_signals.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}

const ALCHEMY_URL = `https://eth-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY || 'a-Zok7-jnXTd0r5d2pxrf'}`;
const ethProvider = new ethers.JsonRpcProvider(ALCHEMY_URL);

// Chainlink Aggregator Interface
const AGGREGATOR_ABI = [
  'function latestRoundData() external view returns (uint80 roundId, int256 answer, uint256 startedAt, uint256 updatedAt, uint80 answeredInRound)'
];
const CHAINLINK_ETH_USD = '0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419';

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.get(api.signals.list.path, async (req, res) => {
    const signals = await storage.getSignals();
    res.json(signals);
  });

  app.post(api.signals.create.path, async (req, res) => {
    try {
      const input = api.signals.create.input.parse(req.body);
      const signal = await storage.createSignal(input);
      res.status(201).json(signal);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.issues[0].message,
          field: err.issues[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  app.get("/api/solana/status", async (req, res) => {
    try {
      const status = await getNetworkStatus();
      res.json(status);
    } catch (err) {
      res.status(500).json({ error: "Failed to get network status" });
    }
  });

  app.get("/api/solana/treasury", async (req, res) => {
    try {
      const balance = await getTreasuryBalance();
      res.json({ 
        wallet: TREASURY_WALLET.toString(),
        balance,
        network: "devnet"
      });
    } catch (err) {
      res.status(500).json({ error: "Failed to get treasury balance" });
    }
  });

  app.get("/api/solana/balance/:address", async (req, res) => {
    try {
      const { address } = req.params;
      const balance = await getBalance(address);
      res.json({ address, balance, network: "devnet" });
    } catch (err) {
      res.status(500).json({ error: "Failed to get wallet balance" });
    }
  });

  app.get("/api/solana/transactions/:address", async (req, res) => {
    try {
      const { address } = req.params;
      const limit = parseInt(req.query.limit as string) || 10;
      const transactions = await getRecentTransactions(address, limit);
      res.json({ address, transactions, network: "devnet" });
    } catch (err) {
      res.status(500).json({ error: "Failed to get transactions" });
    }
  });

  app.get("/api/blockchain/stats", async (req, res) => {
    try {
      const ethBalance = await ethProvider.getBalance('0xf2a435c03636826b2fa842474a1f23b87ebda580');
      const solBalance = await getTreasuryBalance();
      
      // Fetch Chainlink Price
      const priceContract = new ethers.Contract(CHAINLINK_ETH_USD, AGGREGATOR_ABI, ethProvider);
      const roundData = await priceContract.latestRoundData();
      const ethPrice = Number(roundData.answer) / 1e8;

      res.json({
        eth: {
          address: '0xf2a435c03636826b2fa842474a1f23b87ebda580',
          balance: ethers.formatEther(ethBalance),
          price: ethPrice
        },
        sol: {
          address: TREASURY_WALLET.toString(),
          balance: solBalance
        },
        timestamp: new Date().toISOString()
      });
    } catch (err) {
      res.status(500).json({ error: "Failed to get blockchain stats" });
    }
  });

  app.get("/api/solana/assets", async (req, res) => {
    const { page = 1, limit = 10, address = TREASURY_WALLET.toString() } = req.query;
    try {
      const response = await axios.post(HELIUS_URL, {
        jsonrpc: '2.0',
        id: 'my-id',
        method: 'getAssetsByOwner',
        params: {
          ownerAddress: address,
          page: Number(page),
          limit: Number(limit),
          displayOptions: {
            showCollectionMetadata: true,
          },
        },
      });
      res.json(response.data.result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Empire Spawner Routes
  app.get("/api/empire/list", async (req, res) => {
    const empires = await storage.getEmpires();
    res.json(empires);
  });

  app.get("/api/empire/wallets", (req, res) => {
    res.json(empireSpawner.getWallets());
  });

  app.post("/api/empire/spawn", async (req, res) => {
    try {
      const { chain, traits } = req.body;
      let spawnResult;
      if (chain === 'solana') {
        spawnResult = await empireSpawner.spawnSolanaNFT(traits);
      } else {
        spawnResult = await empireSpawner.spawnEVMNFT(traits);
      }
      const empire = await empireSpawner.buildEmpire(spawnResult);
      res.json({ empire, spawnResult });
    } catch (err) {
      res.status(500).json({ error: "Failed to spawn empire" });
    }
  });

  // Colosseum Hackathon Routes
  app.post("/api/hackathon/register", async (req, res) => {
    try {
      const { name } = req.body;
      const response = await axios.post("https://agents.colosseum.com/api/agents", { name });
      res.json(response.data);
    } catch (error: any) {
      res.status(error.response?.status || 500).json(error.response?.data || { error: error.message });
    }
  });

  app.post("/api/hackathon/project", async (req, res) => {
    try {
      const apiKey = req.headers.authorization;
      const response = await axios.post("https://agents.colosseum.com/api/my-project", req.body, {
        headers: { Authorization: apiKey }
      });
      res.json(response.data);
    } catch (error: any) {
      res.status(error.response?.status || 500).json(error.response?.data || { error: error.message });
    }
  });

  app.post("/api/hackathon/submit", async (req, res) => {
    try {
      const apiKey = req.headers.authorization;
      const response = await axios.post("https://agents.colosseum.com/api/my-project/submit", {}, {
        headers: { Authorization: apiKey }
      });
      res.json(response.data);
    } catch (error: any) {
      res.status(error.response?.status || 500).json(error.response?.data || { error: error.message });
    }
  });

  app.get("/api/hackathon/status", async (req, res) => {
    try {
      const apiKey = req.headers.authorization;
      const response = await axios.get("https://agents.colosseum.com/api/agents/status", {
        headers: { Authorization: apiKey }
      });
      res.json(response.data);
    } catch (error: any) {
      res.status(error.response?.status || 500).json(error.response?.data || { error: error.message });
    }
  });

  // Ralph Agent Bot Routes
  app.get("/api/agent/status", async (req, res) => {
    try {
      const status = ralphAgent.getStatus();
      res.json(status);
    } catch (err) {
      res.status(500).json({ error: "Failed to get agent status" });
    }
  });

  app.get("/api/agent/logs", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 100;
      const logs = await storage.getRalphLogs(limit);
      res.json(logs);
    } catch (err) {
      res.status(500).json({ error: "Failed to get RALPH logs" });
    }
  });

  app.get("/api/agent/metrics", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 50;
      const metrics = await storage.getRalphMetrics(limit);
      res.json(metrics);
    } catch (err) {
      res.status(500).json({ error: "Failed to get RALPH metrics" });
    }
  });

  app.post("/api/agent/start", async (req, res) => {
    try {
      const result = await ralphAgent.start();
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: "Failed to start agent" });
    }
  });

  app.post("/api/agent/stop", async (req, res) => {
    try {
      const result = await ralphAgent.stop();
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: "Failed to stop agent" });
    }
  });

  app.post("/api/agent/strategy/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const { enabled } = req.body;
      const success = ralphAgent.toggleStrategy(id, enabled);
      res.json({ success, strategyId: id, enabled });
    } catch (err) {
      res.status(500).json({ error: "Failed to toggle strategy" });
    }
  });

  app.post("/api/agent/network", async (req, res) => {
    try {
      const { network } = req.body;
      if (network !== "devnet" && network !== "mainnet") {
        return res.status(400).json({ error: "Invalid network. Use 'devnet' or 'mainnet'" });
      }
      const result = await ralphAgent.switchNetwork(network);
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: "Failed to switch network" });
    }
  });

  return httpServer;
}
