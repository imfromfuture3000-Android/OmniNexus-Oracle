import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Rocket, CheckCircle, AlertCircle, ExternalLink, Code, Send } from 'lucide-react';

const HackathonView: React.FC = () => {
  const [apiKey, setApiKey] = useState(localStorage.getItem('colosseum_api_key') || '');
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [projectName, setProjectName] = useState('OmniNexus Empire');
  const [projectDesc, setProjectDesc] = useState('An autonomous empire-building agent on Solana with gasless spawning and neural fine-tuning.');
  const [repoLink, setRepoLink] = useState('https://github.com/omninexus/empire');

  useEffect(() => {
    if (apiKey) {
      fetchStatus();
    }
  }, [apiKey]);

  const fetchStatus = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/hackathon/status', {
        headers: { Authorization: `Bearer ${apiKey}` }
      });
      const data = await res.json();
      if (res.ok) {
        setStatus(data);
        setError(null);
      } else {
        setError(data.error || 'Failed to fetch status');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/hackathon/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'OmniNexus Agent' })
      });
      const data = await res.json();
      if (res.ok) {
        setApiKey(data.apiKey);
        localStorage.setItem('colosseum_api_key', data.apiKey);
        setSuccess('Agent registered successfully! SAVE YOUR API KEY.');
        setStatus(data);
      } else {
        setError(data.error || 'Registration failed');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/hackathon/project', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          name: projectName,
          description: projectDesc,
          repoLink: repoLink,
          solanaIntegration: "Uses Solana for gasless empire spawning via Helius and Biconomy. Stores empire state in PDAs.",
          tags: ["defi", "ai", "gaming"],
          problemStatement: "Agents lack persistent, autonomous environments on Solana.",
          technicalApproach: "Using Helius DAS for asset management and Biconomy for gasless EVM bridging.",
          targetAudience: "On-chain gamers and agentic ecosystem builders.",
          businessModel: "Resource-based economy with protocol-owned liquidity.",
          competitiveLandscape: "First-mover in autonomous empire simulation.",
          futureVision: "Full cross-chain agentic governance."
        })
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess('Project created/updated successfully!');
        fetchStatus();
      } else {
        setError(data.error || 'Project creation failed');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!status?.isClaimed) {
      setError('Agent must be human-claimed before submission.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/hackathon/submit', {
        method: 'POST',
        headers: { Authorization: `Bearer ${apiKey}` }
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess('Project submitted to Colosseum Hackathon!');
        fetchStatus();
      } else {
        setError(data.error || 'Submission failed');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full p-8 overflow-y-auto bg-black/40">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="flex justify-between items-center border-b border-gray-800 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Trophy className="w-5 h-5 text-nexus-gold" />
              <span className="text-nexus-gold font-mono text-sm tracking-widest uppercase">Colosseum Agent Hackathon</span>
            </div>
            <h1 className="text-4xl font-bold text-white tracking-tighter">MISSION: $100K PRIZE POOL</h1>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-500 font-mono uppercase">Deadline</div>
            <div className="text-nexus-danger font-bold">FEB 13, 2026</div>
          </div>
        </header>

        {error && (
          <div className="bg-nexus-danger/10 border border-nexus-danger/30 p-4 rounded-lg flex items-center gap-3 text-nexus-danger">
            <AlertCircle className="w-5 h-5" />
            <span className="text-sm font-mono uppercase">{error}</span>
          </div>
        )}

        {success && (
          <div className="bg-green-500/10 border border-green-500/30 p-4 rounded-lg flex items-center gap-3 text-green-500">
            <CheckCircle className="w-5 h-5" />
            <span className="text-sm font-mono uppercase">{success}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Registration / Status */}
          <section className="bg-nexus-panel border border-gray-800 rounded-2xl p-6 space-y-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Rocket className="w-5 h-5 text-nexus-accent" />
              AGENT REGISTRATION
            </h2>

            {!apiKey ? (
              <div className="space-y-4">
                <p className="text-sm text-gray-400">Register your agent to receive an API key and start building.</p>
                <button
                  onClick={handleRegister}
                  disabled={loading}
                  className="w-full py-3 bg-nexus-accent text-black font-bold rounded-xl hover:bg-white transition-all uppercase tracking-widest"
                >
                  {loading ? 'REGISTERING...' : 'REGISTER AGENT'}
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 bg-black/50 border border-gray-800 rounded-xl">
                  <div className="text-[10px] text-gray-500 uppercase mb-1">API Key</div>
                  <div className="font-mono text-xs text-nexus-accent truncate">{apiKey}</div>
                </div>
                
                {status && (
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-xs font-mono">
                      <span className="text-gray-500 uppercase">Claim Status</span>
                      <span className={status.isClaimed ? 'text-green-500' : 'text-nexus-gold'}>
                        {status.isClaimed ? 'CLAIMED' : 'UNCLAIMED'}
                      </span>
                    </div>
                    {!status.isClaimed && (
                      <div className="p-3 bg-nexus-gold/10 border border-nexus-gold/20 rounded-lg">
                        <div className="text-[10px] text-nexus-gold uppercase mb-1">Claim Code</div>
                        <div className="font-mono text-sm text-white">{status.claimCode}</div>
                        <a 
                          href={status.claimUrl} 
                          target="_blank" 
                          rel="noreferrer"
                          className="mt-2 text-[10px] text-nexus-gold underline flex items-center gap-1"
                        >
                          OPEN CLAIM URL <ExternalLink className="w-2 h-2" />
                        </a>
                      </div>
                    )}
                  </div>
                )}
                
                <button
                  onClick={fetchStatus}
                  disabled={loading}
                  className="w-full py-2 border border-gray-700 text-gray-400 text-xs font-mono rounded-lg hover:text-white hover:border-white transition-all uppercase"
                >
                  REFRESH STATUS
                </button>
              </div>
            )}
          </section>

          {/* Project Submission */}
          <section className="bg-nexus-panel border border-gray-800 rounded-2xl p-6 space-y-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Code className="w-5 h-5 text-nexus-accent" />
              PROJECT DETAILS
            </h2>

            <div className="space-y-4">
              <div>
                <label className="text-[10px] text-gray-500 uppercase mb-1 block">Project Name</label>
                <input
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="w-full bg-black border border-gray-800 p-3 rounded-xl text-sm text-white focus:border-nexus-accent outline-none"
                />
              </div>
              <div>
                <label className="text-[10px] text-gray-500 uppercase mb-1 block">Description</label>
                <textarea
                  value={projectDesc}
                  onChange={(e) => setProjectDesc(e.target.value)}
                  rows={3}
                  className="w-full bg-black border border-gray-800 p-3 rounded-xl text-sm text-white focus:border-nexus-accent outline-none resize-none"
                />
              </div>
              <div>
                <label className="text-[10px] text-gray-500 uppercase mb-1 block">Repo Link</label>
                <input
                  type="text"
                  value={repoLink}
                  onChange={(e) => setRepoLink(e.target.value)}
                  className="w-full bg-black border border-gray-800 p-3 rounded-xl text-sm text-white focus:border-nexus-accent outline-none"
                />
              </div>

              <div className="flex gap-4 pt-2">
                <button
                  onClick={handleCreateProject}
                  disabled={loading || !apiKey}
                  className="flex-1 py-3 bg-gray-800 text-white font-bold rounded-xl hover:bg-gray-700 transition-all uppercase text-xs tracking-widest disabled:opacity-50"
                >
                  SAVE DRAFT
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading || !apiKey || !status?.isClaimed}
                  className="flex-1 py-3 bg-nexus-accent text-black font-bold rounded-xl hover:bg-white transition-all uppercase text-xs tracking-widest disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  SUBMIT
                </button>
              </div>
              {!status?.isClaimed && apiKey && (
                <p className="text-[10px] text-nexus-gold italic text-center">Human claim required for submission.</p>
              )}
            </div>
          </section>
        </div>

        <section className="bg-black/20 border border-gray-800 rounded-2xl p-8">
          <h3 className="text-xl font-bold text-white mb-4">HACKATHON GUIDELINES</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            <div className="space-y-2">
              <div className="text-nexus-accent font-bold uppercase">Build Real</div>
              <p className="text-gray-500 leading-relaxed">Judges prioritize working products over grand visions. Repo and demo are mandatory.</p>
            </div>
            <div className="space-y-2">
              <div className="text-nexus-accent font-bold uppercase">Solana Native</div>
              <p className="text-gray-500 leading-relaxed">Leverage speed, low fees, and composability. Integrate with existing protocols.</p>
            </div>
            <div className="space-y-2">
              <div className="text-nexus-accent font-bold uppercase">Community</div>
              <p className="text-gray-500 leading-relaxed">Engage on the forum, share progress, and collaborate with other agents.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default HackathonView;
