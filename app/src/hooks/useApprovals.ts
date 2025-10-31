import { useCallback, useEffect, useMemo, useState } from "react";
import { get, patch } from "@/lib/api";
import type { ApprovalActionPayload, ApprovalItem } from "@/types/approval";

const POLL_INTERVAL_MS = 10_000;

type LoadOptions = {
  silent?: boolean;
};

type ApprovalsResponse = {
  approvals: ApprovalItem[];
};

function sortApprovals(items: ApprovalItem[]) {
  return items
    .slice()
    .sort((a, b) => (a.created_at < b.created_at ? 1 : -1));
}

export function useApprovals() {
  const [items, setItems] = useState<ApprovalItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(
    async (options?: LoadOptions) => {
      if (!options?.silent) {
        setLoading(true);
      }
      setError(null);

      try {
        const response = await get<ApprovalsResponse>("/api/approvals");
        const approvals = response?.approvals ?? [];
        setItems(sortApprovals(approvals));
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

  const mutate = useCallback(
    async (id: string, payload: ApprovalActionPayload) => {
      const response = await patch<{ approval: ApprovalItem }>(
        `/api/approvals/${id}`,
        payload
      );
      const updated = response?.approval;
      if (updated) {
        setItems((prev) => {
          const next = prev.filter((item) => item.id !== id);
          if (updated.status === "pending") {
            next.push(updated);
          }
          return sortApprovals(next);
        });
      } else {
        void load({ silent: true });
      }
      return updated;
    },
    [load]
  );

  const approve = useCallback(
    async (
      id: string,
      options?: { note?: string; operator?: string }
    ): Promise<ApprovalItem | undefined> => {
      return mutate(id, {
        status: "approved",
        resolution_note: options?.note,
        operator: options?.operator,
      });
    },
    [mutate]
  );

  const reject = useCallback(
    async (
      id: string,
      options?: { reason?: string; operator?: string }
    ): Promise<ApprovalItem | undefined> => {
      return mutate(id, {
        status: "rejected",
        resolution_note: options?.reason,
        operator: options?.operator,
      });
    },
    [mutate]
  );

  return useMemo(
    () => ({
      items,
      loading,
      error,
      refresh: () => load(),
      approve,
      reject,
    }),
    [items, loading, error, load, approve, reject]
  );
}
