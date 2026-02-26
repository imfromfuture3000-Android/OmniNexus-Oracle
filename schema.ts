import { pgTable, text, serial, timestamp, numeric, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const alien_signals = pgTable("alien_signals", {
  id: serial("id").primaryKey(),
  walletAddress: text("wallet_address").notNull(),
  transactionHash: text("transaction_hash").notNull(),
  amount: numeric("amount").notNull(),
  status: text("status").notNull(),
  timestamp: timestamp("timestamp").defaultNow(),
});

export const emotional_nfts = pgTable("emotional_nfts", {
  id: serial("id").primaryKey(),
  walletAddress: text("wallet_address").notNull(),
  emotion: text("emotion").notNull(),
  mintHash: text("mint_hash").notNull(),
  zkCompressed: boolean("zk_compressed").default(true),
  metadata: jsonb("metadata"),
  timestamp: timestamp("timestamp").defaultNow(),
});

export const relayer_transactions = pgTable("relayer_transactions", {
  id: serial("id").primaryKey(),
  fromAddress: text("from_address").notNull(),
  toAddress: text("to_address").notNull(),
  originalFee: numeric("original_fee").notNull(),
  actualFee: numeric("actual_fee").default("0"),
  savings: numeric("savings").notNull(),
  status: text("status").notNull(),
  txHash: text("tx_hash"),
  timestamp: timestamp("timestamp").defaultNow(),
});

export const insertAlienSignalSchema = z.object({
  walletAddress: z.string(),
  transactionHash: z.string(),
  amount: z.string(),
  status: z.string(),
});

export const insertEmotionalNftSchema = z.object({
  walletAddress: z.string(),
  emotion: z.string(),
  mintHash: z.string(),
  zkCompressed: z.boolean().optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export const insertRelayerTxSchema = z.object({
  fromAddress: z.string(),
  toAddress: z.string(),
  originalFee: z.string(),
  actualFee: z.string().optional(),
  savings: z.string(),
  status: z.string(),
  txHash: z.string().optional(),
});

export const empires = pgTable("empires", {
  id: serial("id").primaryKey(),
  empireId: text("empire_id").notNull(),
  owner: text("owner").notNull(),
  chain: text("chain").notNull(),
  nftAddress: text("nft_address"),
  level: numeric("level").default("1"),
  resources: jsonb("resources"),
  buildings: jsonb("buildings"),
  status: text("status").notNull(),
  metadata: jsonb("metadata"),
  nexusAccount: text("nexus_account"),
  txHash: text("tx_hash"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const ralph_logs = pgTable("ralph_logs", {
  id: serial("id").primaryKey(),
  level: text("level").notNull(),
  message: text("message").notNull(),
  strategyId: text("strategy_id"),
  profit: numeric("profit"),
  txHash: text("tx_hash"),
  details: jsonb("details"),
  timestamp: timestamp("timestamp").defaultNow(),
});

export const ralph_metrics = pgTable("ralph_metrics", {
  id: serial("id").primaryKey(),
  uptime: numeric("uptime").notNull(),
  cycleCount: serial("cycle_count"),
  totalEarnings: numeric("total_earnings").notNull(),
  successRate: numeric("success_rate").notNull(),
  avgCycleTime: numeric("avg_cycle_time").notNull(),
  timestamp: timestamp("timestamp").defaultNow(),
});

export const insertEmpireSchema = z.object({
  empireId: z.string(),
  owner: z.string(),
  chain: z.string(),
  nftAddress: z.string().optional(),
  level: z.string().optional(),
  resources: z.record(z.string(), z.unknown()).optional(),
  buildings: z.array(z.string()).optional(),
  status: z.string(),
  metadata: z.record(z.string(), z.unknown()).optional(),
  nexusAccount: z.string().optional(),
  txHash: z.string().optional(),
});

export type Empire = typeof empires.$inferSelect;
export type InsertEmpire = z.infer<typeof insertEmpireSchema>;

export type AlienSignal = typeof alien_signals.$inferSelect;
export type InsertAlienSignal = z.infer<typeof insertAlienSignalSchema>;

export type EmotionalNft = typeof emotional_nfts.$inferSelect;
export type InsertEmotionalNft = z.infer<typeof insertEmotionalNftSchema>;

export type RelayerTransaction = typeof relayer_transactions.$inferSelect;
export type InsertRelayerTx = z.infer<typeof insertRelayerTxSchema>;

export type RalphLog = typeof ralph_logs.$inferSelect;
export type InsertRalphLog = z.infer<typeof insertRalphLogSchema>;

export type RalphMetric = typeof ralph_metrics.$inferSelect;
export type InsertRalphMetric = z.infer<typeof insertRalphMetricSchema>;

export const insertRalphLogSchema = z.object({
  level: z.string(),
  message: z.string(),
  strategyId: z.string().optional(),
  profit: z.string().optional(),
  txHash: z.string().optional(),
  details: z.record(z.string(), z.unknown()).optional(),
});

export const insertRalphMetricSchema = z.object({
  uptime: z.string(),
  totalEarnings: z.string(),
  successRate: z.string(),
  avgCycleTime: z.string(),
});
