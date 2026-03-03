import { ReactFlowProvider } from '@xyflow/react';
import { Toaster } from 'sonner';
import { Toolbar } from './components/Toolbar/Toolbar';
import { NodePalette } from './components/NodePalette/NodePalette';
import { FlowCanvas } from './components/Canvas/FlowCanvas';
import { ConfigPanel } from './components/ConfigPanel/ConfigPanel';
import { useRecorderSync } from './hooks/useRecorderSync';

function FlowApp() {
  useRecorderSync();
  return (
    <div className="flex flex-col w-full h-screen">
      <Toolbar />
      <div className="flex flex-1 overflow-hidden">
        <NodePalette />
        <FlowCanvas />
        <ConfigPanel />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ReactFlowProvider>
      <FlowApp />
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: { maxWidth: '420px' },
        }}
      />
    </ReactFlowProvider>
  );
}
