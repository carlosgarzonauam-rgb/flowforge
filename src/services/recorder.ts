// WebSocket client that connects to the FlowForge Recorder (ws://localhost:9222)
// Sends start/stop/pause commands and receives real-time events + final AI summary.

type RecorderState = 'disconnected' | 'idle' | 'recording' | 'paused' | 'analyzing';

type RecorderEvent =
  | { type: 'connected'; status: string }
  | { type: 'ack'; command: string; status: string }
  | { type: 'status'; state: string }
  | { type: 'click' | 'keystroke' | 'window_switch' | 'clipboard' | 'url_change'; timestamp: number; data: Record<string, unknown> }
  | { type: 'summary'; eventCount: number; summary: string; workflow: { nodes: unknown[]; edges: unknown[] } };

interface RecorderCallbacks {
  onStateChange: (state: RecorderState) => void;
  onEvent: (event: RecorderEvent) => void;
  onSummary: (summary: { nodes: unknown[]; edges: unknown[]; description: string }) => void;
  onError: (msg: string) => void;
}

export class RecorderClient {
  private ws: WebSocket | null = null;
  private state: RecorderState = 'disconnected';
  private callbacks: RecorderCallbacks;

  constructor(callbacks: RecorderCallbacks) {
    this.callbacks = callbacks;
  }

  private setState(s: RecorderState) {
    this.state = s;
    this.callbacks.onStateChange(s);
  }

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.ws = new WebSocket('ws://localhost:9222');
      } catch {
        reject(new Error('Could not create WebSocket'));
        return;
      }

      const timeout = setTimeout(() => {
        reject(new Error('FlowForge Recorder not found on ws://localhost:9222.\nMake sure the recorder app is running.'));
        this.ws?.close();
      }, 3000);

      this.ws.onopen = () => {
        clearTimeout(timeout);
      };

      this.ws.onmessage = (e) => {
        let msg: RecorderEvent;
        try { msg = JSON.parse(e.data); } catch { return; }

        if (msg.type === 'connected') {
          this.setState('idle');
          resolve();
          return;
        }

        if (msg.type === 'summary') {
          this.setState('idle');
          this.callbacks.onSummary({
            nodes: msg.workflow?.nodes ?? [],
            edges: msg.workflow?.edges ?? [],
            description: msg.summary ?? '',
          });
          return;
        }

        this.callbacks.onEvent(msg);
      };

      this.ws.onerror = () => {
        clearTimeout(timeout);
        reject(new Error('FlowForge Recorder not found on ws://localhost:9222.\nMake sure the recorder app is running.'));
      };

      this.ws.onclose = () => {
        this.setState('disconnected');
      };
    });
  }

  send(command: 'start' | 'stop' | 'pause' | 'resume') {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ command }));
      if (command === 'start') this.setState('recording');
      if (command === 'pause') this.setState('paused');
      if (command === 'resume') this.setState('recording');
      if (command === 'stop') this.setState('analyzing');
    }
  }

  disconnect() {
    this.ws?.close();
    this.ws = null;
    this.setState('disconnected');
  }

  getState() { return this.state; }
}
