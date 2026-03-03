import { Handle, Position, type NodeProps } from '@xyflow/react';
import type { FlowNode } from '../../types/flow';
import { useFlowStore } from '../../store/useFlowStore';

export function TriggerNode({ id, data, selected }: NodeProps<FlowNode>) {
  const selectNode = useFlowStore((s) => s.selectNode);

  return (
    <div
      onClick={() => selectNode(id)}
      className={`min-w-[160px] rounded-lg border-2 bg-white shadow-md cursor-pointer
        ${selected ? 'border-green-500 ring-2 ring-green-300' : 'border-green-400'}`}
    >
      <div className="flex items-center gap-2 bg-green-500 rounded-t-md px-3 py-2">
        <span className="text-white text-sm">⚡</span>
        <span className="text-white text-xs font-semibold uppercase tracking-wide">Trigger</span>
      </div>
      <div className="px-3 py-2">
        <p className="text-gray-800 text-sm font-medium truncate">{data.label || 'Trigger'}</p>
      </div>
      <Handle type="source" position={Position.Right} className="!bg-green-500 !w-3 !h-3" />
    </div>
  );
}
