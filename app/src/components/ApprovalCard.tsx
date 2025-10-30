import { memo, useState } from "react";
import type { ApprovalItem } from "@/types/approval";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";

interface Props {
  item: ApprovalItem;
  onApprove: (id: string) => void | Promise<void>;
  onReject: (id: string, reason?: string) => void | Promise<void>;
}

function kindLabel(kind: ApprovalItem["kind"]) {
  switch (kind) {
    case "post":
      return "Social Post";
    case "press":
      return "Press Draft";
    case "email":
      return "Email Draft";
    default:
      return "Item";
  }
}

export const ApprovalCard = memo(({ item, onApprove, onReject }: Props) => {
  const [busy, setBusy] = useState<"approve" | "reject" | null>(null);
  const [reason, setReason] = useState("");

  async function handleApprove() {
    try {
      setBusy("approve");
      await onApprove(item.id);
    } finally {
      setBusy(null);
    }
  }

  async function handleReject() {
    try {
      setBusy("reject");
      await onReject(item.id, reason || undefined);
    } finally {
      setBusy(null);
    }
  }

return (
  <Card className="rounded-2xl shadow-sm">
    <CardHeader>
      <div className="flex items-start justify-between gap-3">
        <div>
          <CardTitle className="text-lg">{item.title}</CardTitle>
          <CardDescription className="mt-1 flex items-center gap-2">
            <Badge variant="secondary">{kindLabel(item.kind)}</Badge>
            {item.source && (
              <span className="text-xs text-muted-foreground">
                from {item.source}
              </span>
            )}
            <span className="text-xs text-muted-foreground">
              • {new Date(item.created_at).toLocaleString()}
            </span>
          </CardDescription>
        </div>
        <Badge>{item.status}</Badge>
      </div>
    </CardHeader>

    <CardContent className="space-y-3">
      {item.summary && (
        <p className="text-sm text-muted-foreground">{item.summary}</p>
      )}
      <pre className="text-xs overflow-auto max-h-48 bg-muted/40 p-3 rounded-md">
        {JSON.stringify(item.payload, null, 2)}
      </pre>

      <div className="grid gap-2">
        <Textarea
          placeholder="Optional: add a rejection reason or notes"
          value={reason}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            setReason(e.target.value)
          }
        />
        <div className="flex gap-2 justify-end">
          <Button
            disabled={busy !== null}
            variant="secondary"
            onClick={handleReject}
          >
            {busy === "reject" ? "Rejecting…" : "Reject"}
          </Button>
          <Button disabled={busy !== null} onClick={handleApprove}>
            {busy === "approve" ? "Approving…" : "Approve"}
          </Button>
        </div>
      </div>
    </CardContent>
  </Card>
);

});

ApprovalCard.displayName = "ApprovalCard";
