// MCP Agents Index - Point d'entrée unique
// Créé par OpenClaw pour finalisation 100%

const {scoutAgent} = require('./mcp-agents-aliases');
const {indexAgent} = require('./mcp-agents-aliases');
const {readerAgent} = require('./mcp-agents-aliases');
const {analystAgent} = require('./mcp-agents-aliases');
const {strategicAnalystAgent} = require('./mcp-agents-aliases');
const {rankAgent} = require('./mcp-agents-aliases');
const {pipeline} = require('./mcp-agents-aliases');

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
