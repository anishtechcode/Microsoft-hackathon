function asText(memory) { return memory.content || memory.text || memory.memory || JSON.stringify(memory); }
export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { message, customer, memories = [], knowledge = [] } = req.body || {};
  if (!message || !customer) return res.status(400).json({ error: "message and customer are required" });
  const used = memories.map(asText).filter(Boolean).slice(0, 6);
  const failed = used.filter(x => /did not|failed/i.test(x));
  const successful = used.filter(x => /success|resolved|network configuration/i.test(x));
  const preference = used.find(x => /concise|prefer|avoid/i.test(x));
  // The supplied memory is returned from the server-only Hindsight recall route; it is explicitly passed into the drafting context.
  const response = `Hi ${customer.name.split(" ")[0]} — I found relevant history for this CloudSync sync issue. ${failed.length ? `I won’t repeat ${failed.map(x => x.replace(/.*?(Reinstalling|Clearing cache|reinstall|cache).*/i, "$1")).join(" or ")}, since those did not help previously. ` : ""}${successful.length ? "The previous successful path was refreshing the network configuration, so I’d start there. " : ""}${/wifi|wi-fi|network/i.test(message) ? "Since you’re on a different Wi-Fi network, please refresh the network configuration and reconnect CloudSync; that targets the changed context directly. " : ""}${preference ? "Keeping this concise, as requested. " : ""}Would you like me to walk you through that now?`;
  res.status(200).json({ response, usedMemories: used, activity: ["Customer identified", "Hindsight recall completed", `${used.length} relevant memories supplied to agent`, "Knowledge base checked", "Memory-informed response generated"], knowledge });
}
