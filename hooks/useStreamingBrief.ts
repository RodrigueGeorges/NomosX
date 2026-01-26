/**
 * Streaming Brief Hook
 * 
 * Utilité : Consommer SSE stream avec gestion d'état propre
 * UX Impact : Progress temps réel, pas de fake setTimeout
 */

import { useState, useCallback } from "react";

export type ProgressEvent = {
  step: string;
  message: string;
  progress: number;
};

export type BriefResult = {
  html: string;
  sources: Array<{
    id: string;
    num: number;
    title: string;
    year?: number;
    provider?: string;
  }>;
};

export type StreamState = {
  loading: boolean;
  progress: ProgressEvent | null;
  result: BriefResult | null;
  error: string | null;
};

export function useStreamingBrief() {
  const [state, setState] = useState<StreamState>({
    loading: false,
    progress: null,
    result: null,
    error: null
  });

  const generateBrief = useCallback(async (question: string) => {
    setState({
      loading: true,
      progress: null,
      result: null,
      error: null
    });

    try {
      const eventSource = new EventSource(
        `/api/brief/stream?question=${encodeURIComponent(question)}`
      );

      eventSource.addEventListener('progress', (event) => {
        const data = JSON.parse(event.data) as ProgressEvent;
        setState(prev => ({
          ...prev,
          progress: data
        }));
      });

      eventSource.addEventListener('done', (event) => {
        const data = JSON.parse(event.data) as BriefResult & { progress: number };
        setState({
          loading: false,
          progress: { step: 'done', message: '✓ Brief complété', progress: data.progress },
          result: {
            html: data.html,
            sources: data.sources
          },
          error: null
        });
        eventSource.close();
      });

      eventSource.addEventListener('error', (event) => {
        let errorMessage = 'Une erreur est survenue';
        try {
          const eventData = (event as MessageEvent).data;
          if (eventData && eventData !== 'undefined') {
            const data = JSON.parse(eventData);
            errorMessage = data.message || errorMessage;
          }
        } catch (e) {
          console.error('Error parsing SSE error event:', e);
        }
        setState({
          loading: false,
          progress: null,
          result: null,
          error: errorMessage
        });
        eventSource.close();
      });

      eventSource.onerror = () => {
        setState({
          loading: false,
          progress: null,
          result: null,
          error: 'Connexion perdue avec le serveur'
        });
        eventSource.close();
      };

    } catch (error: any) {
      setState({
        loading: false,
        progress: null,
        result: null,
        error: error.message || 'Une erreur est survenue'
      });
    }
  }, []);

  return {
    ...state,
    generateBrief
  };
}
