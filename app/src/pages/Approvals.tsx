import { useApprovals } from "@/hooks/useApprovals";
import { ApprovalCard } from "@/components/ApprovalCard";
import ApprovalsEmpty from "@/components/ApprovalsEmpty";
import ReviewModal from "@/components/ReviewModal";
import { useToast } from "@/components/ToastProvider";
import { useState } from "react";

export default function ApprovalsPage() {
  const { items, loading, error, approve, reject, load } = useApprovals();
  const [selected, setSelected] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const { push } = useToast();

  const activeItem = items.find((x) => x.id === selected) || null;

  async function approveDirect(id: string) {
    await approve(id);
    push({ title: "Approved", message: "Item approved successfully" });
  }

  async function rejectDirect(id: string, reason?: string) {
    await reject(id, reason);
    push({ title: "Rejected", message: "Item rejected" });
  }

  async function approveWithEdits(id: string, edits?: any) {
    await approve(id, edits);
    push({ title: "Approved", message: "Item approved with edits" });
  }

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Approvals</h1>
        <div className="flex items-center gap-3">
          <button onClick={() => load()} className="text-sm underline">
            Refresh
          </button>
        </div>
      </div>

      {loading && <div className="text-sm text-muted-foreground">Loading…</div>}
      {error && (
        <div className="text-sm text-red-600">
          Failed to load approvals: {error}
        </div>
      )}

      {!loading && !error && items.length === 0 && <ApprovalsEmpty />}

      <div className="grid gap-4">
        {items.map((item) => (
          <div
            key={item.id}
            onDoubleClick={() => {
              setSelected(item.id);
              setModalOpen(true);
            }}
          >
            <ApprovalCard
              item={item}
              onApprove={approveDirect}
              onReject={rejectDirect}
            />
          </div>
        ))}
      </div>

      <ReviewModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        item={activeItem}
        onApprove={approveWithEdits}
        onReject={rejectDirect}
      />
    </div>
  );
}
