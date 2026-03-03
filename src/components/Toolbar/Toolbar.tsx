import { useState } from 'react';
import { useFlowStore } from '../../store/useFlowStore';
import { AIBuildModal } from '../AIBuildModal/AIBuildModal';

export function Toolbar() {
  const [showModal, setShowModal] = useState(false);
  const clearFlow = useFlowStore((s) => s.clearFlow);

  return (
    <>
      <header className="h-12 bg-white border-b border-gray-200 flex items-center px-4 gap-4 shrink-0 z-10">
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-gray-900">FlowForge</span>
          <span className="text-xs bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded font-medium">
            beta
          </span>
        </div>
        <div className="flex-1" />
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-600 text-white text-sm
            font-medium rounded-lg hover:bg-purple-700 transition-colors"
        >
          ✨ AI Build
        </button>
        <button
          onClick={() => {
            if (confirm('Clear the canvas?')) clearFlow();
          }}
          className="px-3 py-1.5 text-sm text-gray-600 border border-gray-300 rounded-lg
            hover:bg-gray-50 transition-colors"
        >
          Clear
        </button>
      </header>
      {showModal && <AIBuildModal onClose={() => setShowModal(false)} />}
    </>
  );
}
