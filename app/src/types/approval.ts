export type ApprovalKind = 'post' | 'press' | 'email' | 'other';


export interface ApprovalItem {
id: string;
kind: ApprovalKind;
title: string;
summary?: string;
payload: unknown; // raw model output or structured content
created_at: string; // ISO
source?: string; // which agent produced this
status: 'pending' | 'approved' | 'rejected';
}


export interface ApprovalsResponse {
items: ApprovalItem[];
}
