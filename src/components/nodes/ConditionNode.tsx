import { Handle, Position, type NodeProps } from '@xyflow/react';
import type { FlowNode } from '../../types/flow';
import { useFlowStore } from '../../store/useFlowStore';

export function ConditionNode({ id, data, selected }: NodeProps<FlowNode>) {
  const selectNode = useFlowStore((s) => s.selectNode);

  return (
    <div
      onClick={() => selectNode(id)}
      className={`min-w-[160px] rounded-lg border-2 bg-white shadow-md cursor-pointer
        ${selected ? 'border-yellow-500 ring-2 ring-yellow-300' : 'border-yellow-400'}`}
    >
      <div className="flex items-center gap-2 bg-yellow-500 rounded-t-md px-3 py-2">
        <span className="text-white text-sm">🔀</span>
        <span className="text-white text-xs font-semibold uppercase tracking-wide">Condition</span>
      </div>
      <div className="px-3 py-2">
        <p className="text-gray-800 text-sm font-medium truncate">{data.label || 'Condition'}</p>
      </div>
      <Handle type="target" position={Position.Left} className="!bg-yellow-500 !w-3 !h-3" />
      <Handle
        type="source"
        position={Position.Right}
        id="true"
        style={{ top: '35%' }}
        className="!bg-green-500 !w-3 !h-3"
      />
      <Handle
        type="source"
        position={Position.Right}
        id="false"
        style={{ top: '65%' }}
        className="!bg-red-500 !w-3 !h-3"
      />
    </div>
  );
}
