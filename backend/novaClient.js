// backend/novaClient.js
// All communication with nova.amazon.com lives here.

export const NOVA_MODEL   = "nova-2-lite-v1";
export const NOVA_BASE = "https://api.nova.amazon.com/v1";

function key() {
  const k = process.env.NOVA_API_KEY;
  if (!k) throw new Error("NOVA_API_KEY is missing — copy env.example to .env and fill it in");
  return k;
}


 // Single completion — always returns a parsed JSON object.
 
export async function callNova(systemPrompt, userMessage) {
  const res = await fetch(NOVA_BASE + "/chat/completions", {
    method:  "POST",
    headers: { "Content-Type": "application/json", Authorization: "Bearer " + key() },
    body: JSON.stringify({
      model:       NOVA_MODEL,
      temperature: 0.1,
      max_tokens:  2048,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user",   content: userMessage  },
      ],
    }),
  });

  if (!res.ok) throw new Error("Nova " + res.status + ": " + await res.text());

  const raw   = (await res.json()).choices?.[0]?.message?.content || "";
  const clean = raw.replace(/```json|```/g, "").trim();
  const match = clean.match(/\{[\s\S]*\}/);
  if (!match) throw new Error("Nova returned non-JSON: " + raw.slice(0, 200));
  return JSON.parse(match[0]);
}

/**
 * Streaming completion — pipes SSE tokens directly into an Express response.
 */
export async function streamNova(expressRes, userMessage) {
  const upstream = await fetch(NOVA_BASE + "/chat/completions", {
    method:  "POST",
    headers: { "Content-Type": "application/json", Authorization: "Bearer " + key() },
    body: JSON.stringify({
      model:    NOVA_MODEL,
      temperature: 0.2,
      max_tokens: 1024,
      stream:   true,
      messages: [
        { role: "system", content: "You are an AWS FinOps agent. Reason step by step." },
        { role: "user",   content: userMessage },
      ],
    }),
  });

  if (!upstream.ok) throw new Error("Nova stream " + upstream.status);

  const reader = upstream.body.getReader();
  const dec    = new TextDecoder();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    for (const line of dec.decode(value).split("\n")) {
      if (!line.startsWith("data:")) continue;
      const p = line.slice(5).trim();
      if (p === "[DONE]") { expressRes.write("data: [DONE]\n\n"); return; }
      try {
        const text = JSON.parse(p).choices?.[0]?.delta?.content || "";
        if (text) expressRes.write("data: " + JSON.stringify({ text }) + "\n\n");
      } catch { /* skip malformed chunks */ }
    }
  }
  expressRes.write("data: [DONE]\n\n");
}
