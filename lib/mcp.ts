import type { LogoName } from "@/components/logos";
import { REGISTRY_NAMESPACE, REGISTRY_URL } from "@/lib/site";

export const MCP_COMPONENTS_JSON = `{
  "registries": {
    "${REGISTRY_NAMESPACE}": "${REGISTRY_URL}"
  }
}`;

export const MCP_CODEX = `[mcp_servers.shadcn]
command = "npx"
args = ["shadcn@latest", "mcp"]`;

export type McpClient = {
  id: "claude" | "cursor" | "vscode" | "codex";
  label: string;
  logo: LogoName;
  color?: string;
  command?: string;
  config?: string;
};

export const MCP_CLIENTS: McpClient[] = [
  {
    id: "claude",
    logo: "claude",
    color: "#D97757",
    label: "Claude Code",
    command: "npx shadcn@latest mcp init --client claude",
  },
  {
    id: "cursor",
    logo: "cursor",
    label: "Cursor",
    command: "npx shadcn@latest mcp init --client cursor",
  },
  {
    id: "vscode",
    logo: "vscode",
    color: "#007ACC",
    label: "VS Code",
    command: "npx shadcn@latest mcp init --client vscode",
  },
  {
    id: "codex",
    logo: "openai",
    label: "Codex",
    config: MCP_CODEX,
  },
];

export const MCP_PROMPT_DIRECT = "add fluid-orb";

export const MCP_PROMPT = `add ${REGISTRY_NAMESPACE}/fluid-orb`;

export const MCP_CLI = `npx shadcn@latest add ${REGISTRY_NAMESPACE}/fluid-orb`;
