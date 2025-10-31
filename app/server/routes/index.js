import { handleApprovals } from "./approvals.js";
import { handleLogs } from "./logs.js";
import { handleIncidents } from "./incidents.js";

export async function handleApiRequest(req, res) {
  const url = new URL(req.url ?? "", "http://localhost");

  if (!url.pathname.startsWith("/api")) {
    return false;
  }

  if (await handleApprovals(req, res, url)) return true;
  if (handleLogs(req, res, url)) return true;
  if (handleIncidents(req, res, url)) return true;

  return false;
}
