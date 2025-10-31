import { listApprovals, updateApproval } from "../data/store.js";
import { readJsonBody, writeJson } from "../utils/http.js";

export async function handleApprovals(req, res, url) {
  if (req.method === "GET" && url.pathname === "/api/approvals") {
    writeJson(res, 200, { approvals: listApprovals() });
    return true;
  }

  if (req.method === "PATCH" && url.pathname.startsWith("/api/approvals/")) {
    const id = url.pathname.replace(/\/$/, "").split("/").pop();
    if (!id) {
      writeJson(res, 400, { error: "Approval id is required" });
      return true;
    }
    let payload;

    try {
      payload = await readJsonBody(req);
    } catch (err) {
      writeJson(res, 400, { error: "Invalid JSON body" });
      return true;
    }

    const { status, resolution_note: resolutionNote, operator } = payload ?? {};

    if (!status || !["approved", "rejected", "pending"].includes(status)) {
      writeJson(res, 400, {
        error: "status must be approved, rejected, or pending",
      });
      return true;
    }

    const resolvedAt = status === "pending" ? undefined : new Date().toISOString();

    const updated = updateApproval(id, {
      status,
      operator,
      resolution_note: resolutionNote,
      resolved_at: resolvedAt,
    });

    if (!updated) {
      writeJson(res, 404, { error: "Approval not found" });
      return true;
    }

    writeJson(res, 200, { approval: updated });
    return true;
  }

  return false;
}
