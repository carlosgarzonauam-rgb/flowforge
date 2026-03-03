import { useCallback } from 'react';
import type { DragEvent } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useReactFlow,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useFlowStore } from '../../store/useFlowStore';
import { nodeTypes } from '../nodes';
import type { NodeType, NodeData } from '../../types/flow';

export function FlowCanvas() {
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    selectNode,
    setNodes,
  } = useFlowStore();

  const { screenToFlowPosition } = useReactFlow();

  const onDragOver = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      const type = event.dataTransfer.getData('nodeType') as NodeType;
      if (!type) return;

      const position = screenToFlowPosition({ x: event.clientX, y: event.clientY });

      const defaultData: NodeData = {
        label: type.charAt(0).toUpperCase() + type.slice(1),
        nodeType: type,
      };

      const newNode = {
        id: crypto.randomUUID(),
        type,
        position,
        data: defaultData,
      };

      setNodes([...nodes, newNode]);
    },
    [nodes, screenToFlowPosition, setNodes]
  );

  const onPaneClick = useCallback(() => {
    selectNode(null);
  }, [selectNode]);

  return (
    <div className="flex-1 h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDragOver={onDragOver}
        onDrop={onDrop}
        onPaneClick={onPaneClick}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.2 }}
      >
        <Background />
        <Controls />
        <MiniMap
          nodeColor={(node) => {
            switch (node.type) {
              case 'trigger': return '#22c55e';
              case 'action': return '#3b82f6';
              case 'condition': return '#eab308';
              case 'ai': return '#a855f7';
              default: return '#94a3b8';
            }
          }}
        />
      </ReactFlow>
    </div>
  );
}
