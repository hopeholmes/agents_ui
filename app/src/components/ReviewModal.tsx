import { useEffect, useMemo, useState } from "react";
import type { ApprovalItem } from "@/types/approval";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

interface ReviewModalProps {
  open: boolean;
  item: ApprovalItem | null;
  onClose: () => void;
  onApprove: (id: string, options?: { note?: string }) => Promise<void> | void;
  onReject: (id: string, options?: { reason?: string }) => Promise<void> | void;
}

export default function ReviewModal({ open, item, onClose, onApprove, onReject }: ReviewModalProps) {
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [payloadText, setPayloadText] = useState("{}");
  const [approvalNote, setApprovalNote] = useState("");
  const [rejectReason, setRejectReason] = useState("");
  const [busy, setBusy] = useState<"approve" | "reject" | null>(null);

  useEffect(() => {
    if (!open || !item) return;
    setTitle(item.title);
    setSummary(item.summary ?? "");
    setPayloadText(JSON.stringify(item.payload ?? {}, null, 2));
    setApprovalNote(item.resolution_note ?? "");
    setRejectReason("");
  }, [item, open]);

  const parsedPayload = useMemo(() => {
    try {
      return JSON.parse(payloadText || "{}");
    } catch (err) {
      console.warn("Invalid payload JSON", err);
      return null;
    }
  }, [payloadText]);

  if (!open || !item) {
    return null;
  }

  async function handleApprove() {
    if (parsedPayload === null) return;
    try {
      setBusy("approve");
      await onApprove(item.id, { note: approvalNote || undefined });
      onClose();
    } finally {
      setBusy(null);
    }
  }

  async function handleReject() {
    try {
      setBusy("reject");
      await onReject(item.id, { reason: rejectReason || undefined });
      onClose();
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="bg-neutral-950 rounded-2xl w-full max-w-3xl shadow-2xl border border-white/10 overflow-hidden">
        <div className="p-4 border-b border-white/5 flex items-center justify-between">
          <div>
            <div className="text-lg font-semibold text-white">Review &amp; Edit</div>
            <div className="text-xs text-gray-400 mt-0.5">{item.id}</div>
          </div>
          <Button variant="ghost" onClick={onClose} className="text-sm text-gray-400">
            Close
          </Button>
        </div>

        <div className="p-4 space-y-4 max-h-[70vh] overflow-auto">
          <div className="grid gap-2">
            <label className="text-xs uppercase tracking-wide text-gray-400">Title</label>
            <input
              className="border border-white/10 rounded-md px-3 py-2 bg-transparent text-sm text-white"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <label className="text-xs uppercase tracking-wide text-gray-400">Summary</label>
            <Textarea value={summary} onChange={(event) => setSummary(event.target.value)} />
          </div>

          <div className="grid gap-2">
            <label className="text-xs uppercase tracking-wide text-gray-400">Payload (JSON)</label>
            <Textarea
              className="font-mono text-xs min-h-[200px]"
              value={payloadText}
              onChange={(event) => setPayloadText(event.target.value)}
            />
            {parsedPayload === null && (
              <div className="text-xs text-red-400">Unable to parse JSON payload.</div>
            )}
          </div>

          <Card className="p-3 text-xs text-muted-foreground bg-black/20 border border-white/5">
            <div>
              Kind: <b>{item.kind}</b> • Source: {item.source || "—"} • Created: {" "}
              {new Date(item.created_at).toLocaleString()}
            </div>
          </Card>

          <div className="grid gap-2">
            <label className="text-xs uppercase tracking-wide text-gray-400">Approval note</label>
            <Textarea
              value={approvalNote}
              onChange={(event) => setApprovalNote(event.target.value)}
              placeholder="Optional notes to attach to the approval"
            />
          </div>

          <div className="grid gap-2">
            <label className="text-xs uppercase tracking-wide text-gray-400">Reject reason</label>
            <Textarea
              value={rejectReason}
              onChange={(event) => setRejectReason(event.target.value)}
              placeholder="Explain why the draft should be revised"
            />
          </div>
        </div>

        <div className="p-4 border-t border-white/5 flex justify-end gap-2">
          <Button
            variant="secondary"
            onClick={handleReject}
            disabled={busy === "approve"}
          >
            {busy === "reject" ? "Rejecting…" : "Reject"}
          </Button>
          <Button
            onClick={handleApprove}
            disabled={parsedPayload === null || busy === "reject"}
          >
            {busy === "approve" ? "Approving…" : "Approve"}
          </Button>
        </div>
      </div>
    </div>
  );
}
