import { useFlowStore } from '../../store/useFlowStore';

export function ConfigPanel() {
  const { nodes, selectedNodeId, updateNodeData } = useFlowStore();
  const node = nodes.find((n) => n.id === selectedNodeId);

  if (!node) {
    return (
      <aside className="w-64 bg-gray-50 border-l border-gray-200 flex flex-col p-4">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Config</p>
        <p className="text-sm text-gray-400 mt-4 text-center">
          Click a node to configure it
        </p>
      </aside>
    );
  }

  const { data } = node;

  const update = (field: string, value: string) => {
    updateNodeData(node.id, { [field]: value });
  };

  return (
    <aside className="w-64 bg-gray-50 border-l border-gray-200 flex flex-col p-4 overflow-y-auto">
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
        Config — {data.nodeType}
      </p>

      {/* Common: label */}
      <label className="block mb-3">
        <span className="text-xs font-medium text-gray-600">Label</span>
        <input
          type="text"
          value={data.label ?? ''}
          onChange={(e) => update('label', e.target.value)}
          className="mt-1 block w-full rounded border border-gray-300 px-2 py-1.5 text-sm
            focus:outline-none focus:ring-2 focus:ring-blue-300"
        />
      </label>

      {/* Trigger fields */}
      {data.nodeType === 'trigger' && (
        <>
          <label className="block mb-3">
            <span className="text-xs font-medium text-gray-600">Method</span>
            <select
              value={data.method ?? 'GET'}
              onChange={(e) => update('method', e.target.value)}
              className="mt-1 block w-full rounded border border-gray-300 px-2 py-1.5 text-sm
                focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              <option>GET</option>
              <option>POST</option>
              <option>schedule</option>
            </select>
          </label>
          {data.method === 'schedule' ? (
            <label className="block mb-3">
              <span className="text-xs font-medium text-gray-600">Cron</span>
              <input
                type="text"
                placeholder="0 * * * *"
                value={data.cron ?? ''}
                onChange={(e) => update('cron', e.target.value)}
                className="mt-1 block w-full rounded border border-gray-300 px-2 py-1.5 text-sm
                  focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </label>
          ) : (
            <label className="block mb-3">
              <span className="text-xs font-medium text-gray-600">URL</span>
              <input
                type="text"
                placeholder="https://..."
                value={data.url ?? ''}
                onChange={(e) => update('url', e.target.value)}
                className="mt-1 block w-full rounded border border-gray-300 px-2 py-1.5 text-sm
                  focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </label>
          )}
        </>
      )}

      {/* Action fields */}
      {data.nodeType === 'action' && (
        <>
          <label className="block mb-3">
            <span className="text-xs font-medium text-gray-600">HTTP Method</span>
            <select
              value={data.httpMethod ?? 'POST'}
              onChange={(e) => update('httpMethod', e.target.value)}
              className="mt-1 block w-full rounded border border-gray-300 px-2 py-1.5 text-sm
                focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              <option>GET</option>
              <option>POST</option>
              <option>PUT</option>
              <option>DELETE</option>
              <option>PATCH</option>
            </select>
          </label>
          <label className="block mb-3">
            <span className="text-xs font-medium text-gray-600">URL</span>
            <input
              type="text"
              placeholder="https://..."
              value={data.url ?? ''}
              onChange={(e) => update('url', e.target.value)}
              className="mt-1 block w-full rounded border border-gray-300 px-2 py-1.5 text-sm
                focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </label>
          <label className="block mb-3">
            <span className="text-xs font-medium text-gray-600">Body Template</span>
            <textarea
              rows={3}
              placeholder='{"key": "{{value}}"}'
              value={data.body ?? ''}
              onChange={(e) => update('body', e.target.value)}
              className="mt-1 block w-full rounded border border-gray-300 px-2 py-1.5 text-sm
                font-mono focus:outline-none focus:ring-2 focus:ring-blue-300 resize-none"
            />
          </label>
        </>
      )}

      {/* Condition fields */}
      {data.nodeType === 'condition' && (
        <label className="block mb-3">
          <span className="text-xs font-medium text-gray-600">Expression</span>
          <input
            type="text"
            placeholder="{{field}} === 'value'"
            value={data.expression ?? ''}
            onChange={(e) => update('expression', e.target.value)}
            className="mt-1 block w-full rounded border border-gray-300 px-2 py-1.5 text-sm
              font-mono focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
          <p className="text-xs text-gray-400 mt-1">True → top handle · False → bottom handle</p>
        </label>
      )}

      {/* AI fields */}
      {data.nodeType === 'ai' && (
        <>
          <label className="block mb-3">
            <span className="text-xs font-medium text-gray-600">Model</span>
            <select
              value={data.model ?? 'claude-sonnet-4-6'}
              onChange={(e) => update('model', e.target.value)}
              className="mt-1 block w-full rounded border border-gray-300 px-2 py-1.5 text-sm
                focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              <option value="claude-sonnet-4-6">Claude Sonnet 4.6</option>
              <option value="claude-opus-4-6">Claude Opus 4.6</option>
              <option value="claude-haiku-4-5-20251001">Claude Haiku 4.5</option>
            </select>
          </label>
          <label className="block mb-3">
            <span className="text-xs font-medium text-gray-600">System Prompt</span>
            <textarea
              rows={3}
              placeholder="You are a helpful assistant..."
              value={data.systemPrompt ?? ''}
              onChange={(e) => update('systemPrompt', e.target.value)}
              className="mt-1 block w-full rounded border border-gray-300 px-2 py-1.5 text-sm
                focus:outline-none focus:ring-2 focus:ring-blue-300 resize-none"
            />
          </label>
          <label className="block mb-3">
            <span className="text-xs font-medium text-gray-600">User Prompt Template</span>
            <textarea
              rows={3}
              placeholder="Summarize: {{input}}"
              value={data.userPrompt ?? ''}
              onChange={(e) => update('userPrompt', e.target.value)}
              className="mt-1 block w-full rounded border border-gray-300 px-2 py-1.5 text-sm
                focus:outline-none focus:ring-2 focus:ring-blue-300 resize-none"
            />
          </label>
        </>
      )}
    </aside>
  );
}
