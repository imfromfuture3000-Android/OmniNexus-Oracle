import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Cpu, Zap, Shield, Activity, ChevronRight, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { omegaPrime } from '../omega-prime';

interface ContractTemplate {
  id: string;
  name: string;
  description: string;
  programId: string;
  space: number;
  lamports: number;
  type: 'token' | 'nft' | 'governance' | 'vault';
}

const CONTRACT_TEMPLATES: ContractTemplate[] = [
  {
    id: 'token-v1',
    name: 'Standard SPL Token',
    description: 'Basic SPL token with mint and freeze authority.',
    programId: 'TokenkegQfeZyiNwAJbVNBH4DQ3TonB1jG97wk26PV',
    space: 165,
    lamports: 2039280,
    type: 'token'
  },
  {
    id: 'nft-v1',
    name: 'Metaplex NFT Master',
    description: 'Standard Metaplex NFT with metadata and royalties.',
    programId: 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s',
    space: 250,
    lamports: 3500000,
    type: 'nft'
  },
  {
    id: 'vault-v1',
    name: 'Secure Vault Protocol',
    description: 'Time-locked vault for asset protection.',
    programId: 'vau1tQfeZyiNwAJbVNBH4DQ3TonB1jG97wk26PV',
    space: 500,
    lamports: 5000000,
    type: 'vault'
  }
];

const DeployerTerminal: React.FC = () => {
  const [selectedContract, setSelectedContract] = useState<ContractTemplate | null>(null);
  const [isDeploying, setIsDeploying] = useState(false);
  const [logs, setLogs] = useState<{ msg: string; type: 'info' | 'success' | 'error' | 'system' }[]>([]);
  const [deploymentResult, setDeploymentResult] = useState<any>(null);

  const addLog = useCallback((msg: string, type: 'info' | 'success' | 'error' | 'system' = 'info') => {
    setLogs(prev => [...prev, { msg, type }].slice(-100));
  }, []);

  const handleDeploy = async () => {
    if (!selectedContract) return;

    setIsDeploying(true);
    setDeploymentResult(null);
    addLog(`INITIALIZING DEPLOYMENT SEQUENCE: ${selectedContract.name.toUpperCase()}`, 'system');
    addLog(`Target Program ID: ${selectedContract.programId}`, 'info');
    addLog(`Allocating ${selectedContract.space} bytes of space...`, 'info');

    try {
      const result = await omegaPrime.deploySolanaContract({
        name: selectedContract.name,
        programId: selectedContract.programId,
        space: selectedContract.space,
        lamports: selectedContract.lamports
      });

      setDeploymentResult(result);
      addLog(`DEPLOYMENT SUCCESSFUL`, 'success');
      addLog(`Signature: ${result.signature}`, 'success');
      addLog(`Timestamp: ${result.timestamp}`, 'info');
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : 'Unknown deployment error';
      addLog(`DEPLOYMENT FAILED: ${errMsg}`, 'error');
      console.error("[DeployerTerminal] Error:", err);
    } finally {
      setIsDeploying(false);
    }
  };

  return (
    <div className="h-full flex flex-col p-6 space-y-6 overflow-hidden bg-black/40">
      {/* Header */}
      <div className="flex justify-between items-end border-b border-gray-800 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Cpu className="w-4 h-4 text-nexus-accent animate-pulse" />
            <span className="text-nexus-accent font-mono text-xs tracking-widest uppercase">Solana Contract Deployer // OMEGA_PRIME_ENGINE</span>
          </div>
          <h2 className="text-3xl font-bold text-white tracking-wider font-mono uppercase">Forge Terminal</h2>
        </div>
        
        <div className="flex gap-4">
          <div className="bg-black/40 border border-gray-800 px-4 py-2 rounded-lg flex items-center gap-3">
            <Activity className="w-4 h-4 text-gray-500" />
            <div className="text-[10px] font-mono">
              <div className="text-gray-500 uppercase">NETWORK_STATUS</div>
              <div className="text-nexus-accent font-bold">DEVNET_STABLE</div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex gap-6 overflow-hidden">
        {/* Left: Contract Templates */}
        <div className="w-1/3 flex flex-col gap-4 overflow-hidden">
          <div className="bg-nexus-panel border border-gray-800 rounded-xl p-4 flex flex-col overflow-hidden">
            <h3 className="text-xs font-mono text-gray-400 uppercase tracking-widest mb-4 border-b border-gray-800 pb-2">Contract Templates</h3>
            <div className="flex-1 overflow-y-auto space-y-3 pr-2">
              {CONTRACT_TEMPLATES.map((contract) => (
                <button
                  key={contract.id}
                  onClick={() => setSelectedContract(contract)}
                  disabled={isDeploying}
                  className={`w-full text-left p-4 rounded-xl border transition-all group
                    ${selectedContract?.id === contract.id 
                      ? 'bg-nexus-accent/10 border-nexus-accent shadow-[0_0_15px_rgba(0,240,255,0.1)]' 
                      : 'bg-black/20 border-gray-800 hover:border-gray-600'}`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase
                      ${contract.type === 'token' ? 'bg-blue-500/20 text-blue-400' : 
                        contract.type === 'nft' ? 'bg-purple-500/20 text-purple-400' : 
                        'bg-nexus-gold/20 text-nexus-gold'}`}>
                      {contract.type}
                    </span>
                    <Shield className={`w-4 h-4 ${selectedContract?.id === contract.id ? 'text-nexus-accent' : 'text-gray-600'}`} />
                  </div>
                  <div className="text-sm font-bold text-white mb-1">{contract.name}</div>
                  <div className="text-[10px] text-gray-500 font-mono line-clamp-2">{contract.description}</div>
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleDeploy}
            disabled={!selectedContract || isDeploying}
            className={`w-full p-4 rounded-xl font-mono font-bold text-sm tracking-widest flex items-center justify-center gap-3 transition-all
              ${!selectedContract || isDeploying 
                ? 'bg-gray-800 text-gray-500 cursor-not-allowed' 
                : 'bg-nexus-accent text-black hover:bg-white hover:shadow-[0_0_20px_rgba(0,240,255,0.5)]'}`}
          >
            {isDeploying ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                DEPLOYING...
              </>
            ) : (
              <>
                <Zap className="w-5 h-5" />
                INITIATE DEPLOYMENT
              </>
            )}
          </button>
        </div>

        {/* Right: Console & Result */}
        <div className="w-2/3 flex flex-col gap-4 overflow-hidden">
          {/* Result Card */}
          <AnimatePresence>
            {deploymentResult && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-nexus-accent/5 border border-nexus-accent/30 rounded-xl p-4 flex items-center gap-4"
              >
                <div className="p-3 bg-nexus-accent/20 rounded-full text-nexus-accent">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-mono text-nexus-accent uppercase tracking-widest font-bold">Deployment Confirmed</div>
                  <div className="text-[10px] text-gray-400 font-mono truncate">SIG: {deploymentResult.signature}</div>
                </div>
                <a 
                  href={`https://explorer.solana.com/tx/${deploymentResult.signature}?cluster=devnet`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 bg-nexus-accent text-black text-[10px] font-bold rounded-lg hover:bg-white transition-colors"
                >
                  VIEW EXPLORER
                </a>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Terminal Console */}
          <div className="flex-1 bg-black/60 border border-gray-800 rounded-xl p-4 font-mono text-[11px] flex flex-col overflow-hidden">
            <div className="flex items-center justify-between mb-4 border-b border-gray-800 pb-2">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-gray-500" />
                <span className="text-gray-500 uppercase tracking-widest">Deployment Console</span>
              </div>
              <div className="flex gap-1.5">
                <div className="w-2 h-2 rounded-full bg-red-500/50"></div>
                <div className="w-2 h-2 rounded-full bg-yellow-500/50"></div>
                <div className="w-2 h-2 rounded-full bg-green-500/50"></div>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto space-y-1.5 scrollbar-hide">
              {logs.length === 0 && (
                <div className="text-gray-700 italic">Waiting for deployment sequence...</div>
              )}
              {logs.map((log, i) => (
                <div key={i} className="flex gap-3">
                  <span className="text-gray-600">[{new Date().toLocaleTimeString()}]</span>
                  <span className={`
                    ${log.type === 'success' ? 'text-green-400' : 
                      log.type === 'error' ? 'text-red-400' : 
                      log.type === 'system' ? 'text-nexus-accent font-bold' : 
                      'text-gray-400'}
                  `}>
                    {log.type === 'error' ? <AlertCircle className="w-3 h-3 inline mr-1 mb-0.5" /> : null}
                    {log.type === 'success' ? <CheckCircle2 className="w-3 h-3 inline mr-1 mb-0.5" /> : null}
                    {log.msg}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeployerTerminal;
