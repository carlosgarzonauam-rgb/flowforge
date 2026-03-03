import { useState, useRef, useEffect } from 'react';
import { buildWorkflowFromPrompt } from '../../services/anthropic';
import { useFlowStore } from '../../store/useFlowStore';

interface AIBuildModalProps {
  onClose: () => void;
}

export function AIBuildModal({ onClose }: AIBuildModalProps) {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const setFlow = useFlowStore((s) => s.setFlow);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleBuild();
  };

  const handleBuild = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const { nodes, edges } = await buildWorkflowFromPrompt(prompt.trim());
      setFlow(nodes, edges);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4 p-6" onKeyDown={handleKeyDown}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">AI Build ✨</h2>
            <p className="text-sm text-gray-500">Describe your workflow and AI will build it</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl leading-none p-1"
          >
            ×
          </button>
        </div>

        <textarea
          ref={textareaRef}
          rows={5}
          placeholder={
            'Example: When a POST webhook arrives, check if the payload amount is > 100, ' +
            'if true send a Slack message, if false log it to a database.'
          }
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          disabled={loading}
          className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm
            focus:outline-none focus:ring-2 focus:ring-purple-400 resize-none
            disabled:opacity-50 disabled:bg-gray-50"
        />

        {error && (
          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
            <strong>Error:</strong> {error}
          </div>
        )}

        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-sm rounded-lg border border-gray-300 text-gray-700
              hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleBuild}
            disabled={loading || !prompt.trim()}
            className="px-4 py-2 text-sm rounded-lg bg-purple-600 text-white font-medium
              hover:bg-purple-700 disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? (
              <>
                <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Building...
              </>
            ) : (
              '✨ Build Workflow'
            )}
          </button>
        </div>

        <p className="text-xs text-gray-400 mt-3 text-center">
          Cmd+Enter to build · Esc to close
        </p>
      </div>
    </div>
  );
}
