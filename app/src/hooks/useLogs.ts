import { useEffect, useRef, useState } from "react";
import axios from "axios";

export interface LogEntry {
  timestamp: string;
  message: string;
}

export function useLogs() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [paused, setPaused] = useState(false);
  const eventRef = useRef<EventSource> | null>(null);

useEffect(() => {
    const url = `${import.meta.env.VITE_API_BASE_URL}/events/logs`;
    const es = new EventSource(url);
    eventRef.current = es;

    es.onmessage = (ev) => {
      if (paused) return;
      try {
        const data: LogEntry = JSON.parse(ev.data);
        setLogs((prev) => [...prev.slice(-199), data]); // keep last 200
      } catch {}
    };

    return () => {
      es.close();
      eventRef.current = null;
    };
  }, [paused]);

  const clear = () => setLogs([]);
  const pause = () => setPaused((p) => !p);

  return { logs, paused, pause, clear };
}
