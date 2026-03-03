import { useEffect } from 'react';
import { toast } from 'sonner';
import { supabase, type Recording } from '../services/supabase';
import { useFlowStore } from '../store/useFlowStore';
import type { FlowNode, FlowEdge } from '../types/flow';

export function useRecorderSync() {
  const setFlow = useFlowStore((s) => s.setFlow);

  useEffect(() => {
    const channel = supabase
      .channel('recordings-insert')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'recordings' },
        (payload) => {
          const row = payload.new as Recording;

          toast('🎉 New workflow from recorder ready!', {
            description: row.summary,
            duration: Infinity, // stays until user acts
            action: {
              label: 'Load',
              onClick: () => {
                setFlow(row.nodes as FlowNode[], row.edges as FlowEdge[]);
                toast.success('Workflow loaded onto canvas');
              },
            },
            cancel: {
              label: 'Dismiss',
              onClick: () => {},
            },
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [setFlow]);
}
