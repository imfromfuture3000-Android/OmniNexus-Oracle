import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, ArrowRight, Shield, Zap, Globe, Cpu } from 'lucide-react';

interface PriceData {
  eth: { price: number };
  timestamp: string;
}

const LandingPage: React.FC<{ onStart: () => void }> = ({ onStart }) => {
  const [price, setPrice] = useState<number | null>(null);

  useEffect(() => {
    fetch('/api/blockchain/stats')
      .then(res => res.json())
      .then(data => setPrice(data.eth.price))
      .catch(() => setPrice(2500));
  }, []);

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden selection:bg-nexus-accent selection:text-black">
      {/* Background Atmosphere */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-nexus-accent/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-nexus-gold/10 blur-[120px] rounded-full"></div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 flex justify-between items-center px-8 py-6 border-b border-white/5 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-nexus-accent rounded-sm rotate-45 flex items-center justify-center">
            <div className="w-4 h-4 bg-black -rotate-45"></div>
          </div>
          <span className="font-bold text-xl tracking-tighter uppercase">OmniNexus</span>
        </div>
        <div className="flex items-center gap-8">
          <div className="hidden md:flex gap-6 text-[10px] font-mono text-gray-500 uppercase tracking-widest">
            <a href="#" className="hover:text-nexus-accent transition-colors">Architecture</a>
            <a href="#" className="hover:text-nexus-accent transition-colors">RALPH Loop</a>
            <a href="#" className="hover:text-nexus-accent transition-colors">Docs</a>
          </div>
          {price && (
            <div className="flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full">
              <TrendingUp className="w-3 h-3 text-green-500" />
              <span className="text-[10px] font-mono text-white">ETH/USD: ${price.toLocaleString()}</span>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 container mx-auto px-8 pt-24 pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-block px-3 py-1 bg-nexus-accent/10 border border-nexus-accent/20 rounded-full"
            >
              <span className="text-[10px] font-mono text-nexus-accent uppercase tracking-[0.2em]">Autonomous State Machine v4.0</span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-7xl md:text-8xl font-bold tracking-tighter leading-[0.9]"
            >
              BUILD <span className="text-nexus-accent">EMPIRES</span> <br />
              WITHOUT <br />
              LIMITS.
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-gray-400 max-w-md leading-relaxed"
            >
              The first cross-chain agentic simulation powered by the RALPH loop. 
              Autonomous resource management, gasless asset spawning, and 
              neural-driven strategy execution.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex items-center gap-6"
            >
              <button 
                onClick={onStart}
                className="group relative px-8 py-4 bg-nexus-accent text-black font-bold rounded-full overflow-hidden transition-all hover:pr-12"
              >
                <span className="relative z-10 uppercase tracking-widest text-xs">Initialize Command</span>
                <ArrowRight className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 opacity-0 group-hover:opacity-100 transition-all" />
              </button>
              <button className="text-xs font-mono text-gray-500 uppercase tracking-widest hover:text-white transition-colors">
                View Architecture
              </button>
            </motion.div>
          </div>

          <div className="relative">
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="relative z-10 aspect-square bg-nexus-panel border border-white/10 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(0,240,255,0.1)]"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-nexus-accent/5 via-transparent to-transparent"></div>
              <div className="h-full flex flex-col p-8">
                <div className="flex justify-between items-start mb-12">
                  <div className="space-y-1">
                    <div className="text-[10px] font-mono text-gray-500 uppercase">System_Status</div>
                    <div className="text-xl font-bold text-nexus-accent">OPERATIONAL</div>
                  </div>
                  <Cpu className="w-8 h-8 text-nexus-accent animate-pulse" />
                </div>
                
                <div className="flex-1 space-y-6">
                  <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: '78%' }}
                      transition={{ delay: 1, duration: 2 }}
                      className="h-full bg-nexus-accent"
                    ></motion.div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                      <div className="text-[8px] font-mono text-gray-500 uppercase mb-1">Neural_Load</div>
                      <div className="text-lg font-bold">42.8%</div>
                    </div>
                    <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                      <div className="text-[8px] font-mono text-gray-500 uppercase mb-1">State_Sync</div>
                      <div className="text-lg font-bold">99.9%</div>
                    </div>
                  </div>
                </div>

                <div className="mt-auto pt-8 border-t border-white/5">
                  <div className="flex justify-between items-center">
                    <div className="flex -space-x-2">
                      {[1,2,3].map(i => (
                        <div key={i} className="w-6 h-6 rounded-full bg-gray-800 border border-black"></div>
                      ))}
                    </div>
                    <div className="text-[10px] font-mono text-gray-500 uppercase">1,284 Active Agents</div>
                  </div>
                </div>
              </div>
            </motion.div>
            
            {/* Decorative Elements */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] border border-white/5 rounded-full pointer-events-none"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] border border-white/5 rounded-full pointer-events-none opacity-50"></div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-48 grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard 
            icon={<Shield className="w-6 h-6 text-nexus-accent" />}
            title="Account Abstraction"
            desc="Gasless spawning on EVM and Solana using Biconomy and Helius DAS."
          />
          <FeatureCard 
            icon={<Zap className="w-6 h-6 text-nexus-gold" />}
            title="RALPH Loop"
            desc="Recursive autonomous logic handler for sub-second state settlement."
          />
          <FeatureCard 
            icon={<Globe className="w-6 h-6 text-blue-500" />}
            title="Cross-Chain State"
            desc="Unified agentic state across multiple chains with persistent identity."
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 py-12 px-8">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-[10px] font-mono text-gray-600 uppercase tracking-widest">
            © 2026 OmniNexus Empire // Built for Colosseum
          </div>
          <div className="flex gap-6">
            <a href="#" className="text-[10px] font-mono text-gray-600 uppercase hover:text-white transition-colors">Twitter</a>
            <a href="#" className="text-[10px] font-mono text-gray-600 uppercase hover:text-white transition-colors">Github</a>
            <a href="#" className="text-[10px] font-mono text-gray-600 uppercase hover:text-white transition-colors">Discord</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) => (
  <div className="p-8 bg-nexus-panel border border-white/5 rounded-3xl hover:border-nexus-accent/30 transition-all group">
    <div className="mb-6 p-3 bg-white/5 rounded-2xl w-fit group-hover:bg-nexus-accent/10 transition-all">
      {icon}
    </div>
    <h3 className="text-xl font-bold mb-3">{title}</h3>
    <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
  </div>
);

export default LandingPage;
