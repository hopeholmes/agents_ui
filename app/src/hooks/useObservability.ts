import { useCallback, useEffect, useMemo, useState } from "react";
import { get } from "@/lib/api";
import type { Incident, ObservabilityLog } from "@/types/observability";

const POLL_INTERVAL_MS = 8_000;

type LogsResponse = {
  logs: ObservabilityLog[];
};

type IncidentsResponse = {
  incidents: Incident[];
};

function sortLogs(logs: ObservabilityLog[]) {
  return logs
    .slice()
    .sort((a, b) => (a.timestamp < b.timestamp ? 1 : -1));
}

function sortIncidents(incidents: Incident[]) {
  return incidents
    .slice()
    .sort((a, b) => (a.detected_at < b.detected_at ? 1 : -1));
}

export function useObservability() {
  const [logs, setLogs] = useState<ObservabilityLog[]>([]);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(
    async (options?: { silent?: boolean }) => {
      if (!options?.silent) {
        setLoading(true);
      }
      setError(null);

      try {
        const [logsResponse, incidentsResponse] = await Promise.all([
          get<LogsResponse>("/api/logs"),
          get<IncidentsResponse>("/api/incidents"),
        ]);

        setLogs(sortLogs(logsResponse?.logs ?? []));
        setIncidents(sortIncidents(incidentsResponse?.incidents ?? []));
      } catch (err) {
        setError((err as Error).message);
      } finally {
        if (!options?.silent) {
          setLoading(false);
        }
      }
    },
    []
  );

  useEffect(() => {
    void load();
    const timer = window.setInterval(() => {
      void load({ silent: true });
    }, POLL_INTERVAL_MS);

    return () => window.clearInterval(timer);
  }, [load]);

  return useMemo(
    () => ({
      logs,
      incidents,
      loading,
      error,
      refresh: () => load(),
    }),
    [logs, incidents, loading, error, load]
  );
}
