import { Connection, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";

export const HELIUS_URL = process.env.HELIUS_HTTP_URL || (process.env.HELIUS_API_KEY ? `https://mainnet.helius-rpc.com/?api-key=${process.env.HELIUS_API_KEY}` : null);
const connection = HELIUS_URL ? new Connection(HELIUS_URL) : null;

export const TREASURY_WALLET = new PublicKey("76x25b6XWTwbm6MTBJtbFU1hFopBSDKsfmGC7MK929RX");

export async function getBalance(address: string) {
  try {
    if (!connection) {
      console.error("Helius connection not configured");
      return 0;
    }
    const pubKey = new PublicKey(address);
    const balance = await connection.getBalance(pubKey);
    return balance / LAMPORTS_PER_SOL;
  } catch (error) {
    console.error("Error fetching balance:", error);
    return 0;
  }
}

export async function getTreasuryBalance() {
  return await getBalance(TREASURY_WALLET.toString());
}

export async function getNetworkStatus() {
  try {
    if (!connection) {
      return { status: "offline", error: "Helius connection not configured" };
    }
    const slot = await connection.getSlot();
    const version = await connection.getVersion();
    return {
      status: "online",
      slot,
      version: version["solana-core"],
    };
  } catch (error) {
    return { status: "offline", error: String(error) };
  }
}

export async function getRecentTransactions(address: string, limit = 10) {
  try {
    if (!connection) {
      console.error("Helius connection not configured");
      return [];
    }
    const pubKey = new PublicKey(address);
    const signatures = await connection.getSignaturesForAddress(pubKey, { limit });
    return signatures;
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return [];
  }
}

export async function getAllPrograms() {
  try {
    if (!connection) {
      console.error("Helius connection not configured");
      return [];
    }
    // BPF Loader program IDs
    const loaderStrings = [
      "BPFLoader1111111111111111111111111111111111",
      "BPFLoader211111111111111111111111111111111",
      "BPFLoaderUpgradeab1e11111111111111111111111"
    ];
    
    const programs = [];
    for (const loaderStr of loaderStrings) {
      try {
        const loader = new PublicKey(loaderStr);
        const accounts = await connection.getProgramAccounts(loader);
        programs.push(...accounts.map(account => ({
          pubkey: account.pubkey.toString(),
          owner: account.account.owner.toString(),
          lamports: account.account.lamports,
          data: account.account.data,
          executable: account.account.executable,
        })));
      } catch (err) {
        console.error(`Error with loader ${loaderStr}:`, err);
      }
    }
    return programs;
  } catch (error) {
    console.error("Error fetching programs:", error);
    return [];
  }
}

export async function getProgramsWithoutOwner() {
  const programs = await getAllPrograms();
  // Filter programs that might not have an update authority or something
  // For upgradeable programs, check if update authority is null
  return programs.filter(program => {
    // For upgradeable loader, the data contains update authority
    if (program.owner === "BPFLoaderUpgradeab1e11111111111111111111111") {
      // Parse the program data to check update authority
      const data = program.data;
      if (data.length >= 4) {
        // Update authority starts at offset 4
        const updateAuthority = data.slice(4, 36);
        // If all zeros, no update authority
        return updateAuthority.every(byte => byte === 0);
      }
    }
    return false;
  });
}
