import Anthropic from '@anthropic-ai/sdk';
import type { FlowNode, FlowEdge } from '../types/flow';

const SYSTEM_PROMPT = `You are a workflow builder AI. Given a plain-English description of a workflow,
return ONLY valid JSON (no markdown, no explanation) matching exactly this structure:

{
  "nodes": [
    {
      "id": "string (unique)",
      "type": "trigger" | "action" | "condition" | "ai",
      "position": { "x": number, "y": number },
      "data": {
        "label": "string",
        "nodeType": "trigger" | "action" | "condition" | "ai",
        // trigger: "method"?: "GET"|"POST"|"schedule", "url"?: string, "cron"?: string
        // action: "httpMethod"?: string, "url"?: string, "body"?: string
        // condition: "expression"?: string
        // ai: "model"?: string, "systemPrompt"?: string, "userPrompt"?: string
      }
    }
  ],
  "edges": [
    {
      "id": "string (unique)",
      "source": "node id",
      "target": "node id",
      "sourceHandle"?: "true" | "false"  // only for condition nodes
    }
  ]
}

Arrange nodes left-to-right with 250px horizontal spacing. Start positions around x:100, y:200.
Return ONLY the JSON object. No markdown fences, no explanation.`;

export async function buildWorkflowFromPrompt(
  prompt: string
): Promise<{ nodes: FlowNode[]; edges: FlowEdge[] }> {
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY as string | undefined;

  if (!apiKey) {
    throw new Error(
      'VITE_ANTHROPIC_API_KEY is not set. Add it to your .env file and restart the dev server.'
    );
  }

  const client = new Anthropic({ apiKey, dangerouslyAllowBrowser: true });

  const message = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 2048,
    system: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: prompt }],
  });

  const raw = message.content[0];
  if (raw.type !== 'text') {
    throw new Error('Unexpected response type from Anthropic API');
  }

  let parsed: { nodes: FlowNode[]; edges: FlowEdge[] };
  try {
    // Strip any accidental markdown fences
    const text = raw.text.replace(/^```(?:json)?\n?/m, '').replace(/\n?```$/m, '').trim();
    parsed = JSON.parse(text);
  } catch {
    throw new Error('AI returned invalid JSON. Try rephrasing your workflow description.');
  }

  if (!Array.isArray(parsed.nodes) || !Array.isArray(parsed.edges)) {
    throw new Error('AI response is missing nodes or edges arrays.');
  }

  return parsed;
}
