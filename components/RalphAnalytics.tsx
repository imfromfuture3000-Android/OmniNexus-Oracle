import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, BarChart, Bar, Cell
} from 'recharts';
import { 
  Activity, Terminal, TrendingUp, Zap, Shield, 
  Clock, CheckCircle, AlertTriangle, Cpu, Database 
} from 'lucide-react';

interface RalphLog {
  id: number;
  level: string;
  message: string;
  strategyId?: string;
  profit?: string;
  txHash?: string;
  details: any;
  timestamp: string;
}

interface RalphMetric {
  id: number;
  uptime: string;
  cycleCount: number;
  totalEarnings: string;
  successRate: string;
  avgCycleTime: string;
  timestamp: string;
}

const RalphAnalytics: React.FC = () => {
  const [logs, setLogs] = useState<RalphLog[]>([]);
  const [metrics, setMetrics] = useState<RalphMetric[]>([]);
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [logsRes, metricsRes, statusRes] = await Promise.all([
          fetch('/api/agent/logs'),
          fetch('/api/agent/metrics'),
          fetch('/api/agent/status')
        ]);
        
        const logsData = await logsRes.json();
        const metricsData = await metricsRes.json();
        const statusData = await statusRes.json();
        
        setLogs(logsData);
        setMetrics(metricsData.reverse()); // Reverse for chronological order in charts
        setStatus(statusData);
      } catch (err) {
        console.error("Failed to fetch RALPH analytics:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  if (loading && !status) {
    return (
      <div className="h-full flex items-center justify-center bg-black/20">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-t-2 border-nexus-accent rounded-full animate-spin"></div>
          <span className="text-nexus-accent font-mono text-xs animate-pulse tracking-widest">ANALYZING RALPH COMMIT LOGS...</span>
        </div>
      </div>
    );
  }

  const chartData = metrics.map(m => ({
    time: new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    earnings: parseFloat(m.totalEarnings),
    success: parseFloat(m.successRate),
    latency: parseFloat(m.avgCycleTime)
  }));

  return (
    <div className="h-full flex flex-col p-6 space-y-6 overflow-hidden bg-black/20">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard 
          title="Total Earnings" 
          value={`${parseFloat(status?.totalEarnings || 0).toFixed(6)} SOL`} 
          icon={<TrendingUp className="w-4 h-4 text-green-500" />}
          trend="+12.4%"
        />
        <StatCard 
          title="Success Rate" 
          value={`${parseFloat(status?.metrics?.successRate || 0).toFixed(1)}%`} 
          icon={<CheckCircle className="w-4 h-4 text-nexus-accent" />}
          trend="Stable"
        />
        <StatCard 
          title="Avg Latency" 
          value={`${Math.round(status?.metrics?.avgCycleTime || 0)}ms`} 
          icon={<Zap className="w-4 h-4 text-nexus-gold" />}
          trend="-5ms"
        />
        <StatCard 
          title="Uptime" 
          value={`${Math.floor((status?.metrics?.uptime || 0) / 3600000)}h ${Math.floor(((status?.metrics?.uptime || 0) % 3600000) / 60000)}m`} 
          icon={<Clock className="w-4 h-4 text-blue-500" />}
          trend="99.9%"
        />
      </div>

      <div className="flex-1 flex gap-6 overflow-hidden">
        {/* Left: Charts & Metrics */}
        <div className="flex-1 flex flex-col gap-6 overflow-hidden">
          {/* Earnings Chart */}
          <div className="bg-nexus-panel border border-gray-800 rounded-xl p-6 flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xs font-mono text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <Activity className="w-4 h-4 text-nexus-accent" />
                Earnings Growth Matrix
              </h3>
              <div className="flex gap-2">
                <span className="w-2 h-2 rounded-full bg-nexus-accent"></span>
                <span className="text-[10px] font-mono text-gray-500">SOL_ACCUMULATION</span>
              </div>
            </div>
            <div className="flex-1 min-h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00F0FF" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#00F0FF" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                  <XAxis dataKey="time" stroke="#4b5563" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="#4b5563" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#000', border: '1px solid #374151', borderRadius: '8px', fontSize: '10px' }}
                    itemStyle={{ color: '#00F0FF' }}
                  />
                  <Area type="monotone" dataKey="earnings" stroke="#00F0FF" fillOpacity={1} fill="url(#colorEarnings)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Performance Grid */}
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-nexus-panel border border-gray-800 rounded-xl p-6">
              <h3 className="text-[10px] font-mono text-gray-500 uppercase mb-4">Strategy Success Distribution</h3>
              <div className="h-[150px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={status?.strategies || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                    <XAxis dataKey="id" stroke="#4b5563" fontSize={8} tickLine={false} axisLine={false} />
                    <YAxis stroke="#4b5563" fontSize={8} tickLine={false} axisLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#000', border: '1px solid #374151', borderRadius: '8px', fontSize: '10px' }}
                    />
                    <Bar dataKey="successRate" radius={[4, 4, 0, 0]}>
                      {status?.strategies?.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#00F0FF' : '#F27D26'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="bg-nexus-panel border border-gray-800 rounded-xl p-6">
              <h3 className="text-[10px] font-mono text-gray-500 uppercase mb-4">Network Latency (ms)</h3>
              <div className="h-[150px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                    <XAxis dataKey="time" stroke="#4b5563" fontSize={8} tickLine={false} axisLine={false} />
                    <YAxis stroke="#4b5563" fontSize={8} tickLine={false} axisLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#000', border: '1px solid #374151', borderRadius: '8px', fontSize: '10px' }}
                    />
                    <Line type="stepAfter" dataKey="latency" stroke="#F27D26" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Execution Traces */}
        <div className="w-1/3 flex flex-col gap-6 overflow-hidden">
          <div className="bg-black border border-gray-800 rounded-xl flex-1 flex flex-col overflow-hidden">
            <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-black/50">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-nexus-accent" />
                <span className="text-xs font-mono text-gray-400 uppercase tracking-widest">Execution Traces</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-[10px] font-mono text-gray-600">LIVE_FEED</span>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-3 font-mono text-[10px] scrollbar-hide">
              {logs.map((log) => (
                <div key={log.id} className="border-l border-gray-800 pl-3 py-1 space-y-1 group">
                  <div className="flex justify-between items-center">
                    <span className={`uppercase font-bold ${
                      log.level === 'success' ? 'text-green-500' : 
                      log.level === 'error' ? 'text-red-500' : 
                      log.level === 'warning' ? 'text-nexus-gold' : 'text-blue-400'
                    }`}>
                      [{log.level}]
                    </span>
                    <span className="text-gray-600">{new Date(log.timestamp).toLocaleTimeString()}</span>
                  </div>
                  <div className="text-gray-300 group-hover:text-white transition-colors">{log.message}</div>
                  {log.txHash && (
                    <div className="text-[9px] text-nexus-accent opacity-60 truncate">TX: {log.txHash}</div>
                  )}
                  {log.profit && parseFloat(log.profit) > 0 && (
                    <div className="text-[9px] text-green-500/80">PROFIT: +{parseFloat(log.profit).toFixed(8)} SOL</div>
                  )}
                </div>
              ))}
              {logs.length === 0 && (
                <div className="h-full flex items-center justify-center text-gray-700 italic">
                  No execution traces found in matrix.
                </div>
              )}
            </div>
          </div>

          {/* System Health */}
          <div className="bg-nexus-panel border border-gray-800 rounded-xl p-6 space-y-4">
            <h3 className="text-[10px] font-mono text-gray-500 uppercase tracking-widest border-b border-gray-800 pb-2">System Health</h3>
            <div className="space-y-3">
              <HealthItem label="Helius RPC" status={status?.metrics?.rpcHealth?.helius} />
              <HealthItem label="Alchemy Node" status={status?.metrics?.rpcHealth?.alchemy} />
              <HealthItem label="Moralis Indexer" status={status?.metrics?.rpcHealth?.moralis} />
              <HealthItem label="Supabase DB" status={true} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, trend }: { title: string, value: string, icon: React.ReactNode, trend: string }) => (
  <div className="bg-nexus-panel border border-gray-800 rounded-xl p-4 space-y-2">
    <div className="flex justify-between items-center">
      <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider">{title}</span>
      {icon}
    </div>
    <div className="flex items-end justify-between">
      <div className="text-xl font-bold text-white tracking-tight">{value}</div>
      <div className={`text-[10px] font-mono ${trend.startsWith('+') ? 'text-green-500' : trend === 'Stable' ? 'text-nexus-accent' : 'text-nexus-gold'}`}>
        {trend}
      </div>
    </div>
  </div>
);

const HealthItem = ({ label, status }: { label: string, status: boolean }) => (
  <div className="flex justify-between items-center">
    <span className="text-[10px] font-mono text-gray-400">{label}</span>
    <div className="flex items-center gap-2">
      <span className={`text-[9px] font-mono ${status ? 'text-green-500' : 'text-red-500'}`}>
        {status ? 'OPERATIONAL' : 'DEGRADED'}
      </span>
      <div className={`w-1.5 h-1.5 rounded-full ${status ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-red-500'}`}></div>
    </div>
  </div>
);

export default RalphAnalytics;
