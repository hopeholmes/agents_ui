import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { get, post } from "@/lib/api";
import { openEventStream } from "@/lib/events";
import type { ApprovalItem, ApprovalsResponse } from "@/types/approval";

export function useApprovals() {
  const [items, setItems] = useState<ApprovalItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const esRef = useRef<EventSource | null>(null);

  // Load pending approvals
  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await get<ApprovalsResponse>("/approvals/pending");
      setItems(res?.items || []);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    void load();
  }, [load]);

  // Live updates via SSE
  useEffect(() => {
    if (esRef.current) return; // prevent duplicates
    try {
      esRef.current = openEventStream(
        `${import.meta.env.VITE_API_BASE_URL}/events/approvals`,
        (data: any) => {
          if (data?.type === "pending" && data.item) {
            setItems((prev) => {
              const exists = prev.some((x) => x.id === data.item.id);
              return exists ? prev : [data.item as ApprovalItem, ...prev];
            });
          }
        }
      );
    } catch {
      /* ignore connection errors */
    }
    return () => {
      esRef.current?.close?.();
      esRef.current = null;
    };
  }, []);

  // Approve / reject actions
  const approve = useCallback(
    async (id: string, edits?: any) => {
      await post(`/approvals/${id}/approve`, edits && Object.keys(edits).length ? edits : undefined);
      setItems((prev) => prev.filter((x) => x.id !== id));
    },
    []
  );

  const reject = useCallback(
    async (id: string, reason?: string) => {
      await post(`/approvals/${id}/reject`, { reason });
      setItems((prev) => prev.filter((x) => x.id !== id));
    },
    []
  );

  return useMemo(
    () => ({ items, loading, error, load, approve, reject }),
    [items, loading, error, load, approve, reject]
  );
}
