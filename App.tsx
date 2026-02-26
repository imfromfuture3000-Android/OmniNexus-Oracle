import React, { useState, useMemo } from 'react';
import { AppView } from './types';
import Dashboard from './components/EmpireSpawnerView';
import AgentHub from './components/AgentHub';
import OmniCanvas from './components/OmniCanvas';
import ArchitectureBlueprint from './components/ArchitectureBlueprint';
import ForgeTerminal from './components/ForgeTerminal';
import SettingsView from './components/SettingsView';
import HackathonView from './components/HackathonView';
import RalphAnalytics from './components/RalphAnalytics';
import { IconDashboard, IconAgents, IconCanvas, IconBlueprint, IconForge, IconSettings, IconTrophy, IconActivity } from './components/Icons';

// Solana Wallet Adapter
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets';
import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl } from '@solana/web3.js';

// Default styles that can be overridden by your app
import '@solana/wallet-adapter-react-ui/styles.css';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.DASHBOARD);

  // The network can be set to 'devnet', 'testnet', or 'mainnet-beta'.
  const network = WalletAdapterNetwork.Devnet;

  // You can also provide a custom RPC endpoint.
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
    ],
    []
  );

  const NavItem = ({ view, label, icon: Icon }: { view: AppView; label: string; icon: any }) => (
    <button
      onClick={() => setCurrentView(view)}
      className={`w-full flex items-center gap-4 px-6 py-4 transition-all duration-300 group border-l-4
        ${currentView === view 
          ? 'bg-nexus-panel/50 border-nexus-accent text-white' 
          : 'border-transparent text-gray-500 hover:text-white hover:bg-white/5'}`}
    >
      <Icon className={`w-6 h-6 ${currentView === view ? 'text-nexus-accent' : 'text-gray-500 group-hover:text-white'}`} />
      <span className="font-mono tracking-widest text-sm uppercase hidden md:inline">{label}</span>
    </button>
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <div className="flex h-screen bg-nexus-dark text-white overflow-hidden font-sans selection:bg-nexus-accent selection:text-black">
            {/* Sidebar */}
            <div className="w-20 md:w-64 flex-shrink-0 border-r border-gray-800 flex flex-col bg-black z-20">
              <div className="h-20 flex items-center justify-center md:justify-start md:px-6 border-b border-gray-800">
                <div className="w-8 h-8 bg-nexus-accent rounded-sm rotate-45 flex items-center justify-center shadow-[0_0_15px_rgba(0,240,255,0.5)]">
                  <div className="w-4 h-4 bg-black -rotate-45"></div>
                </div>
                <span className="hidden md:block ml-4 font-bold text-xl tracking-tighter">OMNI<span className="text-nexus-accent">NEXUS</span></span>
              </div>

              <nav className="flex-1 py-8 space-y-2">
                <NavItem view={AppView.DASHBOARD} label="Empire Dashboard" icon={IconDashboard} />
                <NavItem view={AppView.AGENTS} label="Agent Command" icon={IconAgents} />
                <NavItem view={AppView.RALPH_ANALYTICS} label="RALPH Analytics" icon={IconActivity} />
                <NavItem view={AppView.FORGE} label="Data Forge" icon={IconForge} />
                <NavItem view={AppView.CANVAS} label="Omni-Canvas" icon={IconCanvas} />
                <NavItem view={AppView.BLUEPRINT} label="Architecture" icon={IconBlueprint} />
                <NavItem view={AppView.HACKATHON} label="Hackathon" icon={IconTrophy} />
                <NavItem view={AppView.SETTINGS} label="Settings" icon={IconSettings} />
              </nav>

              <div className="p-6 border-t border-gray-800 hidden md:block">
                <div className="flex items-center gap-3">
                   <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                   <span className="text-xs text-gray-500 font-mono">SYSTEM STABLE</span>
                </div>
                <div className="mt-2 text-[10px] text-gray-700">v4.0.1 // BUILD 9283</div>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col relative overflow-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-900 via-nexus-dark to-black">
              {/* Top Header */}
              <header className="h-16 border-b border-gray-800 flex items-center justify-between px-6 bg-black/50 backdrop-blur-sm">
                 <span className="font-bold hidden md:block uppercase tracking-widest text-xs text-gray-500">{currentView}</span>
                 <span className="font-bold md:hidden">OMNINEXUS</span>
                 <div className="flex items-center gap-4">
                    <WalletMultiButton className="!bg-nexus-accent !text-black !font-mono !text-xs !rounded-lg !h-10 hover:!bg-white transition-all" />
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                 </div>
              </header>

              <main className="flex-1 relative overflow-hidden">
                {/* Subtle Grid Background */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>

                {currentView === AppView.DASHBOARD && <Dashboard />}
                {currentView === AppView.AGENTS && <AgentHub />}
                {currentView === AppView.FORGE && <ForgeTerminal />}
                {currentView === AppView.CANVAS && <OmniCanvas />}
                {currentView === AppView.BLUEPRINT && <ArchitectureBlueprint />}
                {currentView === AppView.RALPH_ANALYTICS && <RalphAnalytics />}
                {currentView === AppView.HACKATHON && <HackathonView />}
                {currentView === AppView.SETTINGS && <SettingsView />}
              </main>
            </div>
          </div>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export default App;
