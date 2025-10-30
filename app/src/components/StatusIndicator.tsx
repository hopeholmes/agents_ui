import { useEffect, useState } from "react";
import axios from "axios";

type Status = "ok" | "loading" | "error";

export default function StatusIndicator() {
  const [status, setStatus] = useState<Status>("loading");

  useEffect(() => {
    const check = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/health`
        );
        setStatus(res.status === 200 ? "ok" : "error");
      } catch {
        setStatus("error");
      }
    };
    check();
    const timer = setInterval(check, 15000);
    return () => clearInterval(timer);
  }, []);

  const color =
    status === "ok"
      ? "bg-green-500"
      : status === "loading"
      ? "bg-yellow-400"
      : "bg-red-500";

  const label =
    status === "ok"
      ? "API Connected"
      : status === "loading"
      ? "Checking…"
      : "Offline";

  return (
    <div className="absolute bottom-4 right-4 flex items-center gap-2 text-xs text-gray-400">
      <span className={`w-3 h-3 rounded-full ${color}`}></span>
      {label}
    </div>
  );
}
