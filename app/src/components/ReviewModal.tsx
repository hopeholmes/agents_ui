import { useEffect, useMemo, useState } from 'react';
await onReject(item.id, rejectReason || undefined);
onClose();
} finally { setBusy(null); }
}


return (
<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
<div className="bg-white dark:bg-neutral-900 rounded-2xl w-full max-w-3xl shadow-xl overflow-hidden">
<div className="p-4 border-b">
<div className="text-lg font-semibold">Review & Edit</div>
</div>
<div className="p-4 space-y-4 max-h-[75vh] overflow-auto">
<div className="grid gap-3">
<label className="text-sm">Title</label>
<input className="border rounded-md px-3 py-2 bg-transparent" value={title} onChange={(e) => setTitle(e.target.value)} />
</div>
<div className="grid gap-3">
<label className="text-sm">Summary</label>
<Textarea value={summary} onChange={(e) => setSummary(e.target.value)} />
</div>
<div className="grid gap-3">
<label className="text-sm">Payload (JSON)</label>
<Textarea className="font-mono text-xs min-h-[200px]" value={payloadText} onChange={(e) => setPayloadText(e.target.value)} />
{parsedPayload === null && <div className="text-xs text-red-600">Invalid JSON</div>}
</div>
<Card className="p-3 text-xs text-muted-foreground">
<div>Kind: <b>{item.kind}</b> • Source: {item.source || '—'} • Created: {new Date(item.created_at).toLocaleString()}</div>
</Card>
<div className="grid gap-2">
<label className="text-sm">Reject reason (optional)</label>
<Textarea value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} />
</div>
</div>
<div className="p-4 border-t flex justify-end gap-2">
<Button variant="secondary" onClick={handleReject} disabled={busy==='approve'}>{busy==='reject' ? 'Rejecting…' : 'Reject'}</Button>
<Button onClick={handleApprove} disabled={parsedPayload===null || busy==='reject'}>{busy==='approve' ? 'Approving…' : 'Approve'}</Button>
<Button variant="ghost" onClick={onClose}>Close</Button>
</div>
</div>
</div>
);
}
