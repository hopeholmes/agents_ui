export type ApprovalKind = "post" | "press" | "email" | "other";

export interface ApprovalItem {
  id: string;
  kind: ApprovalKind;
  title: string;
  summary?: string;
  payload: unknown;
  created_at: string;
  source?: string;
  status: "pending" | "approved" | "rejected";
  operator?: string;
  resolution_note?: string;
  resolved_at?: string;
  updated_at?: string;
}

export interface ApprovalsResponse {
  items: ApprovalItem[];
}

export interface ApprovalActionPayload {
  status: "pending" | "approved" | "rejected";
  resolution_note?: string;
  operator?: string;
}
