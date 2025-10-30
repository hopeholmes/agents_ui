import { useLogs } from "@/hooks/useLogs";

export default function LogsPanel() {
  const { logs, paused, pause, clear } = useLogs();

  return (
    <div className="rounded-2xl border border-white/10 bg-gray-900 p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold text-gray-100">Live Logs</h2>
        <div className="flex gap-2">
          <button
            onClick={pause}
            className="text-sm px-3 py-1 rounded-md bg-gray-700 hover:bg-gray-600"
          >
            {paused ? "Resume" : "Pause"}
          </button>
          <button
            onClick={clear}
            className="text-sm px-3 py-1 rounded-md bg-gray-700 hover:bg-gray-600"
          >
            Clear
          </button>
        </div>
      </div>

      <div className="h-64 overflow-auto text-sm font-mono text-gray-300 bg-black/40 p-2 rounded-md">
        {logs.length === 0 ? (
          <div className="text-gray-500 text-center mt-20">No logs yet</div>
        ) : (
          logs
            .slice()
            .reverse()
            .map((l, i) => (
              <div key={i} className="py-0.5">
                <span className="text-gray-500">{l.timestamp}</span>{" "}
                <span>{l.message}</span>
              </div>
            ))
        )}
      </div>
    </div>
  );
}
