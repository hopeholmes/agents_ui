import type { ObservabilityLog } from "@/types/observability";

interface LogsPanelProps {
  logs: ObservabilityLog[];
  loading?: boolean;
}

function levelBadge(level: ObservabilityLog["level"]) {
  switch (level) {
    case "error":
      return "bg-red-500/20 text-red-200";
    case "warn":
      return "bg-amber-500/20 text-amber-200";
    case "debug":
      return "bg-slate-500/20 text-slate-200";
    default:
      return "bg-emerald-500/20 text-emerald-200";
  }
}

export default function LogsPanel({ logs, loading }: LogsPanelProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-gray-900 p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold text-gray-100">Recent Logs</h2>
      </div>

      <div className="h-64 overflow-auto text-sm font-mono text-gray-300 bg-black/40 p-3 rounded-md">
        {loading ? (
          <div className="text-gray-500 text-center mt-20">Loading logs…</div>
        ) : logs.length === 0 ? (
          <div className="text-gray-500 text-center mt-20">No logs yet</div>
        ) : (
          logs.slice(0, 30).map((log) => (
            <div key={log.id} className="py-1 border-b border-gray-800 last:border-none">
              <div className="flex items-center gap-3 text-xs text-gray-500">
                <span>{new Date(log.timestamp).toLocaleTimeString()}</span>
                <span className={`px-2 py-0.5 rounded ${levelBadge(log.level)}`}>
                  {log.level.toUpperCase()}
                </span>
              </div>
              <div className="text-[13px] text-gray-200">{log.message}</div>
              {log.context && Object.keys(log.context).length > 0 && (
                <pre className="mt-1 text-[11px] text-gray-400 bg-black/40 rounded p-2 overflow-auto max-h-24">
                  {JSON.stringify(log.context, null, 2)}
                </pre>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
