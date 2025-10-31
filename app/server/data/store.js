const now = new Date();

const hoursAgo = (h) => new Date(now.getTime() - h * 60 * 60 * 1000).toISOString();

const approvals = [
  {
    id: "APP-4012",
    kind: "post",
    title: "Launch announcement tweet",
    summary: "Promote the v0.9 launch with short CTA.",
    payload: {
      channel: "twitter",
      body: "We're live with Agents UI v0.9! Come build with us → https://example.com",
    },
    created_at: hoursAgo(3.5),
    source: "Growth Agent",
    status: "pending",
  },
  {
    id: "APP-4013",
    kind: "email",
    title: "Investor update draft",
    summary: "Monthly digest prepared by finance agent.",
    payload: {
      subject: "Monthly highlights",
      recipients: ["investors@example.com"],
      body: "Key KPIs improved 18% MoM. See the attached dashboard for full context.",
    },
    created_at: hoursAgo(5.8),
    source: "Finance Agent",
    status: "pending",
  },
  {
    id: "APP-3998",
    kind: "press",
    title: "Press release outline",
    summary: "Draft statement for infrastructure partnership.",
    payload: {
      headline: "Acme partners with Globex",
      talking_points: [
        "Focus on scalability",
        "Co-marketing agreement in Q2",
      ],
    },
    created_at: hoursAgo(11.2),
    source: "Comms Agent",
    status: "approved",
    resolved_at: hoursAgo(1.1),
    operator: "amanda",
    resolution_note: "Ready to publish after final proofreading.",
  },
];

let logs = [
  {
    id: "LOG-1001",
    timestamp: hoursAgo(0.2),
    level: "info",
    message: "Growth agent queued approval APP-4012",
    context: { agent: "growth", queue: "approvals" },
  },
  {
    id: "LOG-1000",
    timestamp: hoursAgo(1.4),
    level: "warn",
    message: "Playwright check reported flaky step",
    context: { suite: "smoke", retryIn: "15m" },
  },
  {
    id: "LOG-998",
    timestamp: hoursAgo(4.5),
    level: "info",
    message: "Finance agent completed reconciliation",
    context: { run_id: "run_2488" },
  },
];

const incidents = [
  {
    id: "INC-73",
    detected_at: hoursAgo(7.5),
    status: "investigating",
    severity: "medium",
    summary: "Latency spikes detected in orchestrator",
    owner: "on-call",
    metric: "orchestrator.latency_p95",
  },
  {
    id: "INC-68",
    detected_at: hoursAgo(27),
    status: "resolved",
    severity: "low",
    summary: "Slack webhook retries exceeded threshold",
    owner: "automation",
    metric: "integrations.slack.retry_ratio",
    resolved_at: hoursAgo(18),
  },
];

function appendLog(entry) {
  logs = [{
    id: `LOG-${Math.floor(Math.random() * 10_000)}`,
    timestamp: new Date().toISOString(),
    level: entry.level || "info",
    message: entry.message,
    context: entry.context || {},
  }, ...logs].slice(0, 200);
}

export function listApprovals() {
  return approvals.slice().sort((a, b) => (a.created_at < b.created_at ? 1 : -1));
}

export function updateApproval(id, updates) {
  const idx = approvals.findIndex((item) => item.id === id);
  if (idx === -1) return null;

  approvals[idx] = {
    ...approvals[idx],
    ...updates,
    updated_at: new Date().toISOString(),
  };

  appendLog({
    message: `Operator set ${id} to ${approvals[idx].status}`,
    context: { operator: updates.operator || "system", note: updates.resolution_note },
  });

  return approvals[idx];
}

export function listLogs() {
  return logs.slice(0, 100);
}

export function listIncidents() {
  return incidents.slice().sort((a, b) => (a.detected_at < b.detected_at ? 1 : -1));
}
