import { listLogs } from "../data/store.js";
import { writeJson } from "../utils/http.js";

export function handleLogs(req, res, url) {
  if (req.method === "GET" && url.pathname === "/api/logs") {
    writeJson(res, 200, { logs: listLogs() });
    return true;
  }
  return false;
}
