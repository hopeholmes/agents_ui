import { createServer } from "http";
import { handleApiRequest } from "./routes/index.js";
import { writeJson } from "./utils/http.js";

export async function requestListener(req, res) {
  try {
    if (req.method === "GET" && (req.url === "/health" || req.url === "/health/")) {
      writeJson(res, 200, { status: "ok" });
      return;
    }

    if (await handleApiRequest(req, res)) {
      return;
    }

    writeJson(res, 404, { error: "Not found" });
  } catch (err) {
    console.error("Mock API error", err);
    writeJson(res, 500, { error: "Internal server error" });
  }
}

const port = Number.parseInt(process.env.PORT ?? "4000", 10);

if (process.argv[1] && process.argv[1].includes("server/index.js")) {
  const server = createServer((req, res) => {
    requestListener(req, res);
  });
  server.listen(port, () => {
    console.log(`Mock API listening on :${port}`);
  });
}

export default requestListener;
