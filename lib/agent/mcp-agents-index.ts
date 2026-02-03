// MCP Agents Index - Point d'entrée unique
// Créé par OpenClaw pour finalisation 100%

import { scoutAgent } from './mcp-agents-aliases';
import { indexAgent } from './mcp-agents-aliases';
import { readerAgent } from './mcp-agents-aliases';
import { analystAgent } from './mcp-agents-aliases';
import { strategicAnalystAgent } from './mcp-agents-aliases';
import { rankAgent } from './mcp-agents-aliases';
import { pipeline } from './mcp-agents-aliases';

export const mcpAgents = {
  scout: scoutAgent,
  index: indexAgent,
  reader: readerAgent,
  analyst: analystAgent,
  strategic: strategicAnalystAgent,
  rank: rankAgent,
  pipeline: pipeline
};

export default mcpAgents;
