import { 
  alien_signals, emotional_nfts, relayer_transactions, empires, ralph_logs, ralph_metrics,
  type InsertAlienSignal, type AlienSignal,
  type InsertEmotionalNft, type EmotionalNft,
  type InsertRelayerTx, type RelayerTransaction,
  type InsertEmpire, type Empire,
  type InsertRalphLog, type RalphLog,
  type InsertRalphMetric, type RalphMetric
} from "./schema";
import { db } from "./db";
import { desc, eq } from "drizzle-orm";

export interface IStorage {
  createSignal(signal: InsertAlienSignal): Promise<AlienSignal>;
  getSignals(): Promise<AlienSignal[]>;
  createEmotionalNft(nft: InsertEmotionalNft): Promise<EmotionalNft>;
  getEmotionalNfts(): Promise<EmotionalNft[]>;
  createRelayerTx(tx: InsertRelayerTx): Promise<RelayerTransaction>;
  getRelayerTxs(): Promise<RelayerTransaction[]>;
  createEmpire(empire: InsertEmpire): Promise<Empire>;
  getEmpires(): Promise<Empire[]>;
  getEmpireById(empireId: string): Promise<Empire | undefined>;
  updateEmpire(empireId: string, update: Partial<InsertEmpire>): Promise<Empire | undefined>;
  createRalphLog(log: InsertRalphLog): Promise<RalphLog>;
  getRalphLogs(limit?: number): Promise<RalphLog[]>;
  createRalphMetric(metric: InsertRalphMetric): Promise<RalphMetric>;
  getRalphMetrics(limit?: number): Promise<RalphMetric[]>;
}

export class DatabaseStorage implements IStorage {
  async createEmpire(insertEmpire: InsertEmpire): Promise<Empire> {
    const [empire] = await db
      .insert(empires)
      .values(insertEmpire as any)
      .returning();
    return empire;
  }

  async getEmpires(): Promise<Empire[]> {
    return await db
      .select()
      .from(empires)
      .orderBy(desc(empires.id));
  }

  async getEmpireById(empireId: string): Promise<Empire | undefined> {
    const [empire] = await db
      .select()
      .from(empires)
      .where(eq(empires.empireId, empireId));
    return empire;
  }

  async updateEmpire(empireId: string, update: Partial<InsertEmpire>): Promise<Empire | undefined> {
    const [empire] = await db
      .update(empires)
      .set(update as any)
      .where(eq(empires.empireId, empireId))
      .returning();
    return empire;
  }

  async createRalphLog(insertLog: InsertRalphLog): Promise<RalphLog> {
    const [log] = await db
      .insert(ralph_logs)
      .values(insertLog as any)
      .returning();
    return log;
  }

  async getRalphLogs(limit = 100): Promise<RalphLog[]> {
    return await db
      .select()
      .from(ralph_logs)
      .orderBy(desc(ralph_logs.timestamp))
      .limit(limit);
  }

  async createRalphMetric(insertMetric: InsertRalphMetric): Promise<RalphMetric> {
    const [metric] = await db
      .insert(ralph_metrics)
      .values(insertMetric as any)
      .returning();
    return metric;
  }

  async getRalphMetrics(limit = 50): Promise<RalphMetric[]> {
    return await db
      .select()
      .from(ralph_metrics)
      .orderBy(desc(ralph_metrics.timestamp))
      .limit(limit);
  }

  async createSignal(insertSignal: InsertAlienSignal): Promise<AlienSignal> {
    const [signal] = await db
      .insert(alien_signals)
      .values(insertSignal as any)
      .returning();
    return signal;
  }

  async getSignals(): Promise<AlienSignal[]> {
    return await db
      .select()
      .from(alien_signals)
      .orderBy(desc(alien_signals.id))
      .limit(50);
  }

  async createEmotionalNft(insertNft: InsertEmotionalNft): Promise<EmotionalNft> {
    const [nft] = await db
      .insert(emotional_nfts)
      .values(insertNft as any)
      .returning();
    return nft;
  }

  async getEmotionalNfts(): Promise<EmotionalNft[]> {
    return await db
      .select()
      .from(emotional_nfts)
      .orderBy(desc(emotional_nfts.id))
      .limit(50);
  }

  async createRelayerTx(insertTx: InsertRelayerTx): Promise<RelayerTransaction> {
    const [tx] = await db
      .insert(relayer_transactions)
      .values(insertTx as any)
      .returning();
    return tx;
  }

  async getRelayerTxs(): Promise<RelayerTransaction[]> {
    return await db
      .select()
      .from(relayer_transactions)
      .orderBy(desc(relayer_transactions.id))
      .limit(50);
  }
}

export const storage = new DatabaseStorage();
