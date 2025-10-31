import { useObjectives } from "@/hooks/useObjectives";
import { useApprovals } from "@/hooks/useApprovals";
import { useObservability } from "@/hooks/useObservability";
import LogsPanel from "@/components/LogsPanel";
import StatusIndicator from "@/components/StatusIndicator";

export default function Dashboard() {
  const { objectives, loading: loadingObjectives } = useObjectives();
  const {
    items: approvals,
    loading: loadingApprovals,
    error: approvalsError,
    refresh: refreshApprovals,
  } = useApprovals();
  const {
    logs,
    incidents,
    loading: loadingObservability,
    error: observabilityError,
    refresh: refreshObservability,
  } = useObservability();

  const pendingApprovals = approvals.filter((item) => item.status === "pending");

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-amber-300">Dashboard</h1>
        <StatusIndicator />
      </div>

      <section className="bg-gray-800 border border-gray-700 rounded-2xl shadow p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-amber-300">Approvals</h2>
          <button
            type="button"
            onClick={() => refreshApprovals()}
            className="text-xs uppercase tracking-wide text-amber-200 hover:text-amber-100"
          >
            Refresh
          </button>
        </div>
        {loadingApprovals ? (
          <p className="text-gray-400 text-sm">Loading approvals…</p>
        ) : approvalsError ? (
          <p className="text-sm text-red-400">Failed to load approvals: {approvalsError}</p>
        ) : pendingApprovals.length ? (
          <ul className="space-y-2">
            {pendingApprovals.map((approval) => (
              <li
                key={approval.id}
                className="border border-gray-700 rounded-lg p-3 text-sm text-gray-200"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="font-semibold text-amber-200">{approval.title}</span>
                  <span className="text-xs text-gray-400">
                    {new Date(approval.created_at).toLocaleString()}
                  </span>
                </div>
                {approval.summary && (
                  <p className="mt-1 text-xs text-gray-400">{approval.summary}</p>
                )}
                <div className="mt-2 flex items-center gap-2 text-xs text-gray-400">
                  <span className="px-2 py-0.5 rounded bg-amber-400/10 text-amber-200 uppercase tracking-wide">
                    {approval.kind}
                  </span>
                  {approval.source && <span>from {approval.source}</span>}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400 text-sm">No pending approvals.</p>
        )}
      </section>

      <section className="bg-gray-800 border border-gray-700 rounded-2xl shadow p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-amber-300">Observability</h2>
          <button
            type="button"
            onClick={() => refreshObservability()}
            className="text-xs uppercase tracking-wide text-amber-200 hover:text-amber-100"
          >
            Refresh
          </button>
        </div>
        {observabilityError && (
          <p className="text-sm text-red-400">{observabilityError}</p>
        )}
        <LogsPanel logs={logs} loading={loadingObservability} />
        <div className="bg-black/20 rounded-xl border border-gray-700">
          <div className="px-4 py-3 border-b border-gray-700 text-sm font-semibold text-amber-200">
            Active Incidents
          </div>
          <div className="divide-y divide-gray-800">
            {loadingObservability ? (
              <p className="p-4 text-sm text-gray-400">Loading incidents…</p>
            ) : incidents.length ? (
              incidents.slice(0, 4).map((incident) => (
                <div key={incident.id} className="p-4 text-sm text-gray-200 space-y-1">
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-semibold text-amber-100">{incident.summary}</span>
                    <span className="text-xs text-gray-500">{incident.severity.toUpperCase()}</span>
                  </div>
                  <div className="text-xs text-gray-400 flex flex-wrap gap-x-3 gap-y-1">
                    <span>ID {incident.id}</span>
                    <span>Owner: {incident.owner || "unassigned"}</span>
                    <span>
                      Detected {new Date(incident.detected_at).toLocaleString()}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="p-4 text-sm text-gray-400">No active incidents.</p>
            )}
          </div>
        </div>
      </section>

      <section className="bg-gray-800 border border-gray-700 rounded-2xl shadow p-4">
        <h2 className="text-lg font-semibold mb-3 text-amber-300">Agent Memory</h2>
        <p className="text-gray-400 text-sm">
          Memory browsing and embeddings viewer coming soon.
        </p>
      </section>

      <section className="bg-gray-800 border border-gray-700 rounded-2xl shadow p-4">
        <h2 className="text-lg font-semibold mb-3 text-amber-300">Current Objectives</h2>
        {loadingObjectives ? (
          <p className="text-gray-400 text-sm">Loading objectives…</p>
        ) : objectives.length ? (
          <ul className="space-y-2">
            {objectives.map((objective) => (
              <li
                key={objective.id}
                className="border-b border-gray-700 pb-1 text-gray-200 text-sm"
              >
                <span className="font-medium text-amber-200">{objective.title}</span>
                {" "}
                — <em className="text-gray-400">{objective.status}</em>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400 text-sm">No objectives active.</p>
        )}
      </section>
    </div>
  );
}
