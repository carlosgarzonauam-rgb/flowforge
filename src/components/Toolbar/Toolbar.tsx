import { useState, useRef, useCallback, useEffect } from 'react';
import { useFlowStore } from '../../store/useFlowStore';
import { AIBuildModal } from '../AIBuildModal/AIBuildModal';
import { RecorderClient } from '../../services/recorder';
import type { FlowNode, FlowEdge } from '../../types/flow';

type RecordState = 'idle' | 'connecting' | 'recording' | 'paused' | 'analyzing' | 'error';

export function Toolbar() {
  const [showModal, setShowModal] = useState(false);
  const [recordState, setRecordState] = useState<RecordState>('idle');
  const [recordError, setRecordError] = useState<string | null>(null);
  const [eventCount, setEventCount] = useState(0);
  const clientRef = useRef<RecorderClient | null>(null);
  const recordStateRef = useRef<RecordState>('idle');

  // Keep ref in sync so callbacks always see the latest state (avoids stale closures)
  useEffect(() => { recordStateRef.current = recordState; }, [recordState]);

  const clearFlow = useFlowStore((s) => s.clearFlow);
  const setFlow = useFlowStore((s) => s.setFlow);

  const startRecording = useCallback(async () => {
    setRecordError(null);
    setEventCount(0);
    setRecordState('connecting');

    const client = new RecorderClient({
      onStateChange: (state) => {
        if (state === 'disconnected' && recordStateRef.current !== 'idle') {
          setRecordState('error');
          setRecordError('Recorder disconnected. Make sure the recorder app is still running.');
        }
      },
      onEvent: (event) => {
        if ('timestamp' in event) setEventCount((n) => n + 1);
      },
      onSummary: ({ nodes, edges, description }) => {
        setRecordState('idle');
        setFlow(nodes as FlowNode[], edges as FlowEdge[]);
        console.log('Workflow from recording:', description);
      },
      onError: (msg) => {
        setRecordState('error');
        setRecordError(msg);
      },
    });

    try {
      await client.connect();
      clientRef.current = client;
      client.send('start');
      setRecordState('recording');
    } catch (err) {
      setRecordState('error');
      setRecordError(err instanceof Error ? err.message : 'Connection failed');
      clientRef.current = null;
    }
  }, [recordState, setFlow]);

  const stopRecording = useCallback(() => {
    setRecordState('analyzing');
    clientRef.current?.send('stop');
    // Safety timeout — if no summary arrives in 60s, reset
    setTimeout(() => {
      setRecordState((s) => {
        if (s === 'analyzing') {
          setRecordError('Analysis timed out. Try recording a shorter session.');
          return 'error';
        }
        return s;
      });
    }, 60000);
  }, []);

  const pauseRecording = useCallback(() => {
    clientRef.current?.send('pause');
    setRecordState('paused');
  }, []);

  const resumeRecording = useCallback(() => {
    clientRef.current?.send('resume');
    setRecordState('recording');
  }, []);

  const cancelError = () => {
    setRecordState('idle');
    setRecordError(null);
    clientRef.current?.disconnect();
    clientRef.current = null;
  };

  return (
    <>
      <header className="h-12 bg-white border-b border-gray-200 flex items-center px-4 gap-3 shrink-0 z-10">
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-gray-900">FlowForge</span>
          <span className="text-xs bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded font-medium">
            beta
          </span>
        </div>

        <div className="flex-1" />

        {/* Record controls */}
        {recordState === 'idle' && (
          <button
            onClick={startRecording}
            title="Record your screen and auto-generate a workflow with AI"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500 text-white text-sm
              font-medium rounded-lg hover:bg-red-600 transition-colors"
          >
            ● Record
          </button>
        )}

        {recordState === 'connecting' && (
          <span className="text-sm text-gray-400 flex items-center gap-1.5">
            <span className="inline-block w-3 h-3 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
            Connecting...
          </span>
        )}

        {recordState === 'recording' && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-red-500 font-medium animate-pulse flex items-center gap-1">
              ● REC {eventCount > 0 && <span className="text-gray-400">· {eventCount} events</span>}
            </span>
            <button
              onClick={pauseRecording}
              className="px-2.5 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
              title="Pause recording"
            >
              ⏸
            </button>
            <button
              onClick={stopRecording}
              className="px-2.5 py-1.5 bg-gray-800 text-white text-sm rounded-lg hover:bg-gray-900"
              title="Stop and analyze with AI"
            >
              ⏹ Stop & Analyze
            </button>
          </div>
        )}

        {recordState === 'paused' && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-yellow-600 font-medium">⏸ Paused</span>
            <button
              onClick={resumeRecording}
              className="px-2.5 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              ▶ Resume
            </button>
            <button
              onClick={stopRecording}
              className="px-2.5 py-1.5 bg-gray-800 text-white text-sm rounded-lg hover:bg-gray-900"
            >
              ⏹ Stop & Analyze
            </button>
          </div>
        )}

        {recordState === 'analyzing' && (
          <span className="text-sm text-purple-600 flex items-center gap-1.5 font-medium">
            <span className="inline-block w-3 h-3 border-2 border-purple-300 border-t-purple-600 rounded-full animate-spin" />
            AI analyzing session...
          </span>
        )}

        {recordState === 'error' && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-red-600 max-w-xs truncate" title={recordError ?? ''}>
              ⚠ {recordError}
            </span>
            <button onClick={cancelError} className="text-xs text-gray-500 underline">
              dismiss
            </button>
          </div>
        )}

        <div className="w-px h-5 bg-gray-200" />

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-600 text-white text-sm
            font-medium rounded-lg hover:bg-purple-700 transition-colors"
        >
          ✨ AI Build
        </button>

        <button
          onClick={() => { if (confirm('Clear the canvas?')) clearFlow(); }}
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
