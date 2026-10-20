import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';

type Role = 'user' | 'assistant';
type Message = { role: Role; content: string };

const providerUrl = Deno.env.get('AI_API_URL') ?? 'https://openrouter.ai/api/v1/chat/completions';
const model = Deno.env.get('AI_MODEL') ?? 'meta-llama/llama-3.3-70b-instruct:free';
const apiKey = Deno.env.get('AI_API_KEY');
const requests = new Map<string, { count: number; resetAt: number }>();
const maxRequestsPerMinute = 12;

// Keep this short so it is useful context without crowding out the visitor's question.
// It is derived from src/data/destinations.ts.
const destinationContext = `Project destinations: Gateway of India (Mumbai) — Where Mumbai meets the sea; Tarkarli (Sindhudurg) — Crystal waters of the Konkan; Mahabaleshwar (Satara) — Strawberry fields and misty valleys; Kolhapur (Kolhapur) — Heritage, flavour, and fierce pride; Nashik (Nashik) — Where the sacred meets the vine; Ajanta Caves (Chhatrapati Sambhajinagar) — Two millennia of art, carved in stone; Tadoba (Chandrapur) — Where the tiger still roams free; Lonar Crater Lake (Buldhana) — A 52,000-year-old cosmic accident.`;
const systemPrompt = `You are MahaSafar's friendly travel assistant for Maharashtra. Help with destinations, itineraries, budgets, best time to visit, food and safety. Keep answers short and practical. If you are unsure about prices, timings or availability, say so and suggest checking live sources. Do not invent facts.\n\n${destinationContext}`;

function corsHeaders(request: Request) {
  const origin = request.headers.get('origin') ?? '';
  const allowed = /^https:\/\/[^/]+\.github\.io$/.test(origin) || /^http:\/\/localhost(?::\d+)?$/.test(origin);
  return { 'Access-Control-Allow-Origin': allowed ? origin : 'null', 'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type', 'Access-Control-Allow-Methods': 'POST, OPTIONS', Vary: 'Origin' };
}

function response(body: unknown, status: number, request: Request) {
  return new Response(JSON.stringify(body), { status, headers: { ...corsHeaders(request), 'Content-Type': 'application/json' } });
}

function isRateLimited(request: Request) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? 'unknown';
  const now = Date.now();
  const record = requests.get(ip);
  if (!record || record.resetAt < now) { requests.set(ip, { count: 1, resetAt: now + 60_000 }); return false; }
  record.count += 1;
  return record.count > maxRequestsPerMinute;
}

function validMessages(value: unknown): Message[] | null {
  if (!Array.isArray(value) || value.length === 0) return null;
  const messages = value.slice(-10).map((message) => {
    if (!message || typeof message !== 'object') return null;
    const { role, content } = message as Record<string, unknown>;
    if ((role !== 'user' && role !== 'assistant') || typeof content !== 'string') return null;
    const trimmed = content.trim().slice(0, 1000);
    return trimmed ? { role, content: trimmed } as Message : null;
  });
  return messages.every(Boolean) ? messages as Message[] : null;
}

serve(async (request) => {
  if (request.method === 'OPTIONS') return new Response(null, { headers: corsHeaders(request) });
  if (request.method !== 'POST') return response({ error: 'Method not allowed' }, 405, request);
  if (isRateLimited(request)) return response({ error: 'Too many requests' }, 429, request);
  if (!apiKey) return response({ error: 'Assistant unavailable' }, 503, request);

  let body: { messages?: unknown };
  try { body = await request.json(); } catch { return response({ error: 'Invalid request' }, 400, request); }
  const messages = validMessages(body.messages);
  if (!messages) return response({ error: 'Messages are required' }, 400, request);

  try {
    const aiResponse = await fetch(providerUrl, { method: 'POST', headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json', 'HTTP-Referer': 'https://github.com/', 'X-Title': 'MahaSafar' }, body: JSON.stringify({ model, messages: [{ role: 'system', content: systemPrompt }, ...messages], temperature: 0.5, max_tokens: 450 }) });
    if (!aiResponse.ok) return response({ error: 'Assistant provider unavailable' }, 502, request);
    const result = await aiResponse.json();
    const reply = result?.choices?.[0]?.message?.content;
    if (typeof reply !== 'string' || !reply.trim()) return response({ error: 'Invalid assistant response' }, 502, request);
    return response({ reply: reply.trim() }, 200, request);
  } catch { return response({ error: 'Assistant provider unavailable' }, 502, request); }
});
