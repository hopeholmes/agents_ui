import { listIncidents } from "../data/store.js";
import { writeJson } from "../utils/http.js";

export function handleIncidents(req, res, url) {
  if (req.method === "GET" && url.pathname === "/api/incidents") {
    writeJson(res, 200, { incidents: listIncidents() });
    return true;
  }
  return false;
}
