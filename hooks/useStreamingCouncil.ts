/**
 * Streaming Council Hook
 * 
 * Utilité : Consommer SSE stream Council avec gestion d'état propre
 * UX Impact : Progress temps réel pour multi-perspectives
 */

import { useState, useCallback } from "react";

export type ProgressEvent = {
  step: string;
  message: string;
  progress: number;
};

export type CouncilResult = {
  economic: string;
  technical: string;
  ethical: string;
  political: string;
  synthesis: string;
  uncertainty: string;
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
  result: CouncilResult | null;
  error: string | null;
};

export function useStreamingCouncil() {
  const [state, setState] = useState<StreamState>({
    loading: false,
    progress: null,
    result: null,
    error: null
  });

  const generateCouncil = useCallback(async (question: string) => {
    setState({
      loading: true,
      progress: null,
      result: null,
      error: null
    });

    try {
      const eventSource = new EventSource(
        `/api/council/stream?question=${encodeURIComponent(question)}`
      );

      eventSource.addEventListener('progress', (event) => {
        const data = JSON.parse(event.data) as ProgressEvent;
        setState(prev => ({
          ...prev,
          progress: data
        }));
      });

      eventSource.addEventListener('done', (event) => {
        const data = JSON.parse(event.data) as CouncilResult & { progress: number };
        setState({
          loading: false,
          progress: { step: 'done', message: '✓ Conseil complété', progress: data.progress },
          result: {
            economic: data.economic,
            technical: data.technical,
            ethical: data.ethical,
            political: data.political,
            synthesis: data.synthesis,
            uncertainty: data.uncertainty,
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
    generateCouncil
  };
}
