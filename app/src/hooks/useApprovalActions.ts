import axios from "axios";

export async function handleApprovalAction(ids: string[], action: "approve" | "reject") {
  try {
    const res = await axios.patch(
      `${import.meta.env.VITE_API_BASE_URL}/approvals/action`,
      { ids, action },
      { headers: { "Content-Type": "application/json" } }
    );
    return res.data.updated || [];
  } catch (err) {
    console.error("Approval action failed:", err);
    throw err;
  }
}
