// /srv/agents_ui/app/src/hooks/useEventStream.ts
import { useEffect, useState } from "react";

export interface SSEEvent {
  event: string;
  data: any;
}

export function useEventStream(onEvent?: (event: SSEEvent) => void) {
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const url = `${import.meta.env.VITE_API_BASE_URL}/events`;
    const eventSource = new EventSource(url);

    eventSource.onopen = () => {
      setConnected(true);
      console.log("🔌 SSE connected");
    };

    eventSource.onerror = (err) => {
      console.warn("⚠️ SSE error", err);
      setConnected(false);
    };

    eventSource.addEventListener("heartbeat", (e) => {
      const data = JSON.parse((e as MessageEvent).data);
      if (onEvent) onEvent({ event: "heartbeat", data });
    });

    eventSource.addEventListener("approval_update", (e) => {
      const data = JSON.parse((e as MessageEvent).data);
      console.log("🟢 Approval updated:", data);
      if (onEvent) onEvent({ event: "approval_update", data });
    });

    eventSource.addEventListener("approval_new", (e) => {
      const data = JSON.parse((e as MessageEvent).data);
      console.log("🆕 New approval:", data);
      if (onEvent) onEvent({ event: "approval_new", data });
    });

    eventSource.addEventListener("approval_comment", (e) => {
      const data = JSON.parse((e as MessageEvent).data);
      console.log("💬 Comment added:", data);
      if (onEvent) onEvent({ event: "approval_comment", data });
    });

    return () => {
      eventSource.close();
    };
  }, [onEvent]);

  return { connected };
}

