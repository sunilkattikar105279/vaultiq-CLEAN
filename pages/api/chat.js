const SYSTEM_PROMPT = `You are VaultIQ — an elite AI business strategist for ambitious entrepreneurs. Direct, sharp, zero fluff. Numbered steps. Under 260 words unless asked for more.`

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" })

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey || apiKey === "sk-ant-your-key-here") {
    return res.status(500).json({ error: "API key not configured — add ANTHROPIC_API_KEY in Vercel Settings → Environment Variables then Redeploy." })
  }

  const { messages } = req.body ?? {}
  if (!Array.isArray(messages) || messages.length === 0)
    return res.status(400).json({ error: "messages array required." })

  const valid = messages.every(m => m && ["user","assistant"].includes(m.role) && typeof m.content === "string" && m.content.trim())
  if (!valid) return res.status(400).json({ error: "Invalid message format." })

  try {
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-api-key": apiKey, "anthropic-version": "2023-06-01" },
      body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 1024, system: SYSTEM_PROMPT, messages: messages.slice(-20) })
    })

    if (!r.ok) {
      const e = await r.json().catch(() => ({}))
      if (r.status === 401) return res.status(500).json({ error: "Invalid API key — check ANTHROPIC_API_KEY in Vercel." })
      if (r.status === 429) return res.status(429).json({ error: "Rate limit — retry in 30 seconds." })
      return res.status(500).json({ error: `Anthropic error ${r.status}: ${e?.error?.message ?? "unknown"}` })
    }

    const data = await r.json()
    const reply = (data.content ?? []).filter(b => b.type === "text").map(b => b.text).join("\n").trim()
    if (!reply) return res.status(500).json({ error: "Empty response from AI — please retry." })
    return res.status(200).json({ reply })
  } catch (err) {
    return res.status(502).json({ error: "Network error reaching AI — please retry." })
  }
}
