import { useState, useMemo } from "react";
import { useApprovals } from "@/hooks/useApprovals";
import { ApprovalCard } from "@/components/ApprovalCard";
import ApprovalsEmpty from "@/components/ApprovalsEmpty";
import ReviewModal from "@/components/ReviewModal";
import { useToast } from "@/components/ToastProvider";

export default function ApprovalsPage() {
  const { items, loading, error, refresh, approve, reject } = useApprovals();
  const [selected, setSelected] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const { push } = useToast();

  const pendingItems = useMemo(
    () => items.filter((item) => item.status === "pending"),
    [items]
  );
  const activeItem = items.find((item) => item.id === selected) ?? null;

  async function approveDirect(id: string, options?: { note?: string }) {
    await approve(id, options);
    push({ title: "Approved", message: "Item approved successfully" });
  }

  async function rejectDirect(id: string, options?: { reason?: string }) {
    await reject(id, options);
    push({ title: "Rejected", message: "Item rejected" });
  }

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Approvals</h1>
        <div className="flex items-center gap-3">
          <button onClick={() => refresh()} className="text-sm underline">
            Refresh
          </button>
        </div>
      </div>

      {loading && <div className="text-sm text-muted-foreground">Loading…</div>}
      {error && (
        <div className="text-sm text-red-500">Failed to load approvals: {error}</div>
      )}

      {!loading && !error && pendingItems.length === 0 && <ApprovalsEmpty />}

      <div className="grid gap-4">
        {pendingItems.map((item) => (
          <div
            key={item.id}
            onDoubleClick={() => {
              setSelected(item.id);
              setModalOpen(true);
            }}
          >
            <ApprovalCard item={item} onApprove={approveDirect} onReject={rejectDirect} />
          </div>
        ))}
      </div>

      <ReviewModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        item={activeItem}
        onApprove={approveDirect}
        onReject={rejectDirect}
      />
    </div>
  );
}
