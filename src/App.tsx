import { ReactFlowProvider } from '@xyflow/react';
import { Toolbar } from './components/Toolbar/Toolbar';
import { NodePalette } from './components/NodePalette/NodePalette';
import { FlowCanvas } from './components/Canvas/FlowCanvas';
import { ConfigPanel } from './components/ConfigPanel/ConfigPanel';

export default function App() {
  return (
    <ReactFlowProvider>
      <div className="flex flex-col w-full h-screen">
        <Toolbar />
        <div className="flex flex-1 overflow-hidden">
          <NodePalette />
          <FlowCanvas />
          <ConfigPanel />
        </div>
      </div>
    </ReactFlowProvider>
  );
}
