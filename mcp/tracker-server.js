// Minimal MCP server exposing the Free AI Tier Tracker catalogue.
// Registered in .kiro/settings/mcp.json — any MCP-capable agent can query it.
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  ListToolsRequestSchema,
  CallToolRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { readFileSync } from 'node:fs';

const tools = JSON.parse(readFileSync(new URL('../data/tools.json', import.meta.url)));

const server = new Server(
  { name: 'tier-tracker', version: '1.0.0' },
  { capabilities: { tools: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: 'list_tools',
      description: 'List the names of all tracked free AI tools',
      inputSchema: { type: 'object', properties: {} },
    },
    {
      name: 'get_tool',
      description: 'Get the full catalogue entry for one tool by name',
      inputSchema: {
        type: 'object',
        properties: { name: { type: 'string' } },
        required: ['name'],
      },
    },
  ],
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  if (name === 'list_tools') {
    return { content: [{ type: 'text', text: JSON.stringify(tools.map((t) => t.name)) }] };
  }
  if (name === 'get_tool') {
    const tool = tools.find(
      (t) => t.name.toLowerCase() === String(args?.name ?? '').toLowerCase()
    );
    if (!tool) throw new Error(`Unknown tool: ${args?.name}`);
    return { content: [{ type: 'text', text: JSON.stringify(tool, null, 2) }] };
  }
  throw new Error(`Unknown tool: ${name}`);
});

const transport = new StdioServerTransport();
await server.connect(transport);
