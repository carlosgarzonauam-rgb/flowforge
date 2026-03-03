import { Handle, Position, type NodeProps } from '@xyflow/react';
import type { FlowNode } from '../../types/flow';
import { useFlowStore } from '../../store/useFlowStore';

export function AiNode({ id, data, selected }: NodeProps<FlowNode>) {
  const selectNode = useFlowStore((s) => s.selectNode);

  return (
    <div
      onClick={() => selectNode(id)}
      className={`min-w-[160px] rounded-lg border-2 bg-white shadow-md cursor-pointer
        ${selected ? 'border-purple-500 ring-2 ring-purple-300' : 'border-purple-400'}`}
    >
      <div className="flex items-center gap-2 bg-purple-500 rounded-t-md px-3 py-2">
        <span className="text-white text-sm">🤖</span>
        <span className="text-white text-xs font-semibold uppercase tracking-wide">AI</span>
      </div>
      <div className="px-3 py-2">
        <p className="text-gray-800 text-sm font-medium truncate">{data.label || 'AI Step'}</p>
      </div>
      <Handle type="target" position={Position.Left} className="!bg-purple-500 !w-3 !h-3" />
      <Handle type="source" position={Position.Right} className="!bg-purple-500 !w-3 !h-3" />
    </div>
  );
}
