export type LogLevel = "debug" | "info" | "warn" | "error";

export interface ObservabilityLog {
  id: string;
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: Record<string, unknown>;
}

export type IncidentStatus = "investigating" | "mitigated" | "resolved" | "acknowledged";
export type IncidentSeverity = "low" | "medium" | "high" | "critical";

export interface Incident {
  id: string;
  detected_at: string;
  status: IncidentStatus;
  severity: IncidentSeverity;
  summary: string;
  owner?: string;
  metric?: string;
  resolved_at?: string;
}
