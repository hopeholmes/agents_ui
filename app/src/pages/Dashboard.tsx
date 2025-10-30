import { useObjectives } from "@/hooks/useObjectives";
import { useApprovals } from "@/hooks/useApprovals";
import { useLogs } from "@/hooks/useLogs";
import { useEventStream } from "@/hooks/useEventStream";
import LogsPanel from "@/components/LogsPanel";
import StatusIndicator from "@/components/StatusIndicator";

export default function Dashboard() {
  const { objectives, loading: loadingObjectives } = useObjectives();
  const { items, loading: loadingApprovals } = useApprovals();
  const { logs, loading: loadingLogs } = useLogs();

  // Optional: listen for live events
  useEventStream((event) => {
    console.log("Received event:", event);
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-amber-300">Dashboard</h1>
        <StatusIndicator />
      </div>

      {/* 📨 Approvals */}
      <section className="bg-gray-800 border border-gray-700 rounded-2xl shadow p-4">
        <h2 className="text-lg font-semibold mb-3 text-amber-300">Approvals</h2>
        {loadingApprovals ? (
          <p className="text-gray-400 text-sm">Loading pending approvals...</p>
        ) : items.length ? (
          <ul className="space-y-2">
            {items.map((a) => (
              <li
                key={a.id}
                className="border-b border-gray-700 pb-1 text-gray-200 text-sm"
              >
                <span className="font-medium text-amber-200">[{a.kind}]</span>{" "}
                {a.summary}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400 text-sm">No pending approvals.</p>
        )}
      </section>

      {/* 📜 Agent Logs */}
      <section className="bg-gray-800 border border-gray-700 rounded-2xl shadow p-4">
        <h2 className="text-lg font-semibold mb-3 text-amber-300">Agent Logs</h2>
        {loadingLogs ? (
          <p className="text-gray-400 text-sm">Loading logs...</p>
        ) : logs.length ? (
          <div className="bg-black/40 rounded-lg p-3 h-48 overflow-y-auto text-sm text-gray-200">
            {logs.map((log, idx) => (
              <div key={idx} className="border-b border-gray-700 py-1">
                {log}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-sm">No logs available.</p>
        )}
      </section>

      {/* 🧠 Agent Memory */}
      <section className="bg-gray-800 border border-gray-700 rounded-2xl shadow p-4">
        <h2 className="text-lg font-semibold mb-3 text-amber-300">Agent Memory</h2>
        <p className="text-gray-400 text-sm">
          Memory browsing and embeddings viewer coming soon.
        </p>
      </section>

      {/* 🎯 Current Objectives */}
      <section className="bg-gray-800 border border-gray-700 rounded-2xl shadow p-4">
        <h2 className="text-lg font-semibold mb-3 text-amber-300">
          Current Objectives
        </h2>
        {loadingObjectives ? (
          <p className="text-gray-400 text-sm">Loading objectives...</p>
        ) : objectives.length ? (
          <ul className="space-y-2">
            {objectives.map((o) => (
              <li
                key={o.id}
                className="border-b border-gray-700 pb-1 text-gray-200 text-sm"
              >
                <span className="font-medium text-amber-200">{o.title}</span>{" "}
                — <em className="text-gray-400">{o.status}</em>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400 text-sm">No objectives active.</p>
        )}
      </section>

      {/* Full Logs Panel */}
      <LogsPanel />
    </div>
  );
}
