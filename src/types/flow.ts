import type { Node, Edge } from '@xyflow/react';

export type NodeType = 'trigger' | 'action' | 'condition' | 'ai';

export interface NodeData {
  label: string;
  nodeType: NodeType;
  // trigger fields
  method?: string;
  url?: string;
  cron?: string;
  // action fields
  httpMethod?: string;
  body?: string;
  // condition fields
  expression?: string;
  // ai fields
  model?: string;
  systemPrompt?: string;
  userPrompt?: string;
  [key: string]: unknown;
}

export type FlowNode = Node<NodeData>;
export type FlowEdge = Edge;
