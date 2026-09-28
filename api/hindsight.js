const base = process.env.HINDSIGHT_BASE_URL || "https://api.hindsight.vectorize.io";
const key = process.env.HINDSIGHT_API_KEY;
const bank = process.env.HINDSIGHT_BANK_ID;

function headers() { return { "content-type": "application/json", authorization: `Bearer ${key}` }; }
async function call(path, method, body) {
  if (!key || !bank) throw new Error("Hindsight is not configured. Set HINDSIGHT_API_KEY and HINDSIGHT_BANK_ID on the server.");
  const response = await fetch(`${base.replace(/\/$/, "")}${path}`, { method, headers: headers(), body: body ? JSON.stringify(body) : undefined });
  if (!response.ok) throw new Error(`Hindsight ${response.status}: ${await response.text()}`);
  return response.json();
}

export default async function handler(req, res) {
  try {
    if (req.method === "GET") return res.status(200).json({ configured: Boolean(key && bank), bankId: bank ? "configured" : null });
    const { action, query, memories, customerId } = req.body || {};
    if (!customerId) return res.status(400).json({ error: "customerId is required" });
    const metadata = { customerId, product: "CloudSync", source: "RecallDesk" };
    console.info("hindsight", { action, customerId });
    if (action === "recall") {
      const data = await call(`/v1/banks/${bank}/recall`, "POST", { query, metadata, top_k: 8 });
      return res.status(200).json({ memories: data.results || data.memories || [], rawCount: (data.results || data.memories || []).length });
    }
    if (action === "retain") {
      if (!Array.isArray(memories) || !memories.length) return res.status(400).json({ error: "memories is required" });
      const data = await call(`/v1/banks/${bank}/retain`, "POST", { memories: memories.map(content => ({ content, metadata })) });
      return res.status(200).json({ stored: memories.length, result: data });
    }
    return res.status(400).json({ error: "Unknown action" });
  } catch (error) { console.error("hindsight error", error.message); return res.status(502).json({ error: error.message }); }
}
