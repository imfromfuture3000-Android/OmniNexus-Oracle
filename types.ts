export enum AgentRole {
  STRATEGIST = 'STRATEGIST',
  BUILDER = 'BUILDER',
  DIPLOMAT = 'DIPLOMAT',
  WARLORD = 'WARLORD'
}

export interface Agent {
  id: string;
  name: string;
  role: AgentRole;
  description: string;
  avatarColor: string;
  specialty: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'agent' | 'system';
  text: string;
  timestamp: Date;
}

export interface ImageEditState {
  originalImage: string | null; // base64
  generatedImage: string | null; // base64
  prompt: string;
  isLoading: boolean;
  error: string | null;
}

export enum AppView {
  DASHBOARD = 'DASHBOARD',
  AGENTS = 'AGENTS',
  CANVAS = 'CANVAS',
  BLUEPRINT = 'BLUEPRINT',
  FORGE = 'FORGE',
  SETTINGS = 'SETTINGS',
  EMPIRE_SPAWNER = 'EMPIRE_SPAWNER',
  HACKATHON = 'HACKATHON',
  RALPH_ANALYTICS = 'RALPH_ANALYTICS',
  DEPLOYER = 'DEPLOYER',
  LANDING = 'LANDING'
}

export interface BlockchainStats {
  eth: {
    address: string;
    balance: string;
    price: number;
  };
  sol: {
    address: string;
    balance: number;
  };
  timestamp: string;
}

export interface ForgeFile {
  id: string;
  name: string;
  content: string;
  type: 'script' | 'record' | 'config';
  timestamp: string;
}

export interface HeliusAsset {
  id: string;
  content: {
    json_uri: string;
    metadata: {
      name: string;
      symbol: string;
    };
    links?: {
      image?: string;
    };
  };
  compression?: {
    compressed: boolean;
    leaf_id: number;
  };
}
