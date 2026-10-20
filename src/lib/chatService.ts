// MahaSafar — Chat Service
// getChatReply tries Mode A (Supabase Edge Function) and falls back to Mode B (local keyword matching).

import { supabase } from './supabase';
import { sampleDestinations } from '../data/destinations';
import { sampleHiddenSpots } from '../data/hiddenSpots';
import { categories } from '../data/categories';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: number;
}

// ─── Mode B: local keyword fallback ──────────────────────────────────────────

function delay(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

function randomDelay() {
  return delay(400 + Math.random() * 300); // 400–700 ms
}

function localReply(messages: ChatMessage[]): string {
  const lastUser = [...messages].reverse().find((m) => m.role === 'user');
  if (!lastUser) return greeting();

  const q = lastUser.content.toLowerCase();

  // Greetings
  if (/^(hi|hello|hey|namaste|namaskar|good\s*(morning|evening|afternoon))/.test(q)) {
    return greeting();
  }

  // Hidden / offbeat
  if (/hidden|offbeat|secret|undiscovered|lesser.?known|unexplored/.test(q)) {
    const spots = sampleHiddenSpots.slice(0, 4);
    const list = spots.map((s) => `• **${s.name}** (${s.districtName}) — ${s.description.slice(0, 80)}…`).join('\n');
    return `Here are some hidden gems in Maharashtra you might love:\n\n${list}\n\nFor full details and how to reach them, visit the Hidden Maharashtra section on MahaSafar.`;
  }

  // Trip planning / itinerary / budget
  if (/plan|itinerary|schedule|budget|cost|expense|days|trip/.test(q)) {
    return `Great question! Here are some quick planning tips for Maharashtra:\n\n• **Duration**: Most popular destinations need 1–3 days each.\n• **Budget**: Expect ₹1,500–₹3,000/day for budget travel; ₹5,000–₹10,000/day for comfortable stays.\n• **Best time**: October to March suits most destinations.\n• **Getting around**: Self-drive or MSRTC buses are popular; trains connect major cities.\n\nVisit the **Plan Trip** page (/plan) to build a custom itinerary with cost estimates!`;
  }

  // Hill stations
  if (/hill.?station|hill|mist|valley|mountain|sahyadri|western.?ghats/.test(q)) {
    const hills = sampleDestinations.filter((d) =>
      d.categories.some((c) => ['hill-station', 'mountain', 'nature'].includes(c))
    );
    if (hills.length) {
      const list = hills.map((d) => `• **${d.name}** — ${d.tagline} (Best: ${d.bestTime.months.slice(0, 3).join(', ')})`).join('\n');
      return `Maharashtra's hill stations in the Sahyadri range:\n\n${list}\n\nOpen any destination on MahaSafar for detailed itineraries and stay options.`;
    }
  }

  // Beaches
  if (/beach|coast|sea|konkan|ocean|sand|shore|water.?sport/.test(q)) {
    const beaches = sampleDestinations.filter((d) =>
      d.categories.some((c) => ['beach', 'water-sports', 'diving'].includes(c))
    );
    if (beaches.length) {
      const list = beaches.map((d) => `• **${d.name}** — ${d.tagline}`).join('\n');
      return `Beautiful beaches along Maharashtra's Konkan coast:\n\n${list}\n\nTarkarli is especially great for scuba diving and snorkelling. Open the destination page for full details.`;
    }
  }

  // Forts
  if (/fort|maratha|shivaji|castle|citadel/.test(q)) {
    const forts = sampleDestinations.filter((d) => d.categories.includes('fort'));
    const list = forts.length
      ? forts.map((d) => `• **${d.name}** — ${d.tagline}`).join('\n')
      : '• Raigad Fort, Pratapgad, Sinhagad, Daulatabad Fort — scattered across the Sahyadri';
    return `Maharashtra has over 350 forts — some of the finest Maratha military architecture:\n\n${list}\n\nMahabaleshwar's **Pratapgad Fort** and the Ajanta region are great starting points.`;
  }

  // Temples / spiritual
  if (/temple|spiritual|pilgrimage|jyotirlinga|goddess|mandir|devi|shiva|ganesh/.test(q)) {
    const spiritual = sampleDestinations.filter((d) => d.categories.includes('spiritual'));
    const list = spiritual.map((d) => `• **${d.name}** — ${d.tagline}`).join('\n');
    return `Maharashtra is home to many sacred pilgrimage sites:\n\n${list}\n\nNashik's **Trimbakeshwar** (one of 12 Jyotirlingas) and **Kolhapur's Mahalakshmi Temple** (a Shakti Peetha) are must-visits.`;
  }

  // Wildlife / safari
  if (/wildlife|tiger|safari|jungle|forest|national.?park|tadoba|bird/.test(q)) {
    const wildlife = sampleDestinations.filter((d) => d.categories.includes('wildlife'));
    const list = wildlife.map((d) => `• **${d.name}** — ${d.tagline}`).join('\n');
    return `Maharashtra's wildlife destinations:\n\n${list}\n\n**Tadoba-Andhari Tiger Reserve** is one of India's best for tiger sightings. Best season: March–May and October–November. Safari bookings fill up fast — book in advance!`;
  }

  // Heritage / caves / UNESCO
  if (/heritage|ajanta|ellora|cave|unesco|history|archaeological|ancient/.test(q)) {
    const heritage = sampleDestinations.filter((d) =>
      d.categories.some((c) => ['heritage', 'cave', 'unesco'].includes(c))
    );
    const list = heritage.map((d) => `• **${d.name}** — ${d.tagline}`).join('\n');
    return `Maharashtra's UNESCO and heritage highlights:\n\n${list}\n\n**Ajanta Caves** (2nd century BCE) are a world-class archaeological treasure. Combine with **Ellora Caves** for a complete Marathwada heritage circuit.`;
  }

  // Specific destination lookup
  for (const dest of sampleDestinations) {
    const nameLower = dest.name.toLowerCase();
    const districtLower = dest.district.toLowerCase();
    if (q.includes(nameLower) || q.includes(districtLower) || q.includes(dest.slug.replace(/-/g, ' '))) {
      return `**${dest.name}** — ${dest.tagline}\n\n${dest.story.slice(0, 220)}…\n\n🗓 **Best time**: ${dest.bestTime.months.slice(0, 4).join(', ')}\n⏱ **Ideal stay**: ${dest.idealDays} day${dest.idealDays > 1 ? 's' : ''}\n🏨 **Budget stay**: ${dest.stayOptions.budget.range}\n\nOpen the destination page on MahaSafar for the full itinerary and travel tips!`;
    }
  }

  // Lonavala specifically (popular but not in destinations list)
  if (/lonavala|khandala/.test(q)) {
    return `**Lonavala & Khandala** are classic weekend getaways from Pune (65 km) and Mumbai (95 km).\n\n🗓 **Best time**: July–September (monsoon waterfalls) or October–February (clear skies)\n⏱ **Ideal stay**: 1–2 days\n🌿 **Highlights**: Bhushi Dam, Tiger's Leap, Rajmachi Fort trek, Lohagad Fort, Karla & Bhaja Caves\n🍫 **Famous for**: Chikki (brittle candy) and fudge\n\nFor a custom plan, visit the **Plan Trip** page on MahaSafar!`;
  }

  // Mumbai specifically
  if (/mumbai|bombay/.test(q)) {
    return `**Mumbai** — the city that never sleeps, and Maharashtra's crown jewel.\n\n🏛 **Must-see**: Gateway of India, Elephanta Caves, Marine Drive, Colaba, Dharavi, Sanjay Gandhi National Park\n🍽 **Food**: Vada Pav, Pav Bhaji, Mumbai street snacks at Juhu Chowpatty\n🗓 **Best time**: November–February\n\nMumbai also works as a base to explore the Konkan coast further south.`;
  }

  // What can you answer / help
  if (/what.*(can|do)|help|tell me|know about|topic/.test(q)) {
    return canAnswerMessage();
  }

  // Best time
  if (/best.?time|when.*visit|season|monsoon|summer|winter/.test(q)) {
    return `**Best times to visit Maharashtra:**\n\n• **October – February** (winter): Best for most destinations — forts, beaches, cities, wildlife\n• **March – May** (summer): Great for Tadoba tiger safaris; avoid hill stations in peak summer\n• **June – September** (monsoon): Waterfalls, Kaas Plateau flowers, lush Konkan — but roads can be difficult\n\nMonsoon is magical in the Konkan and Sahyadri if you're comfortable with rain!`;
  }

  // Categories overview
  if (/categor|type|kind|sort|list/.test(q)) {
    const cats = categories.map((c) => `• **${c.name}**: ${c.description}`).join('\n');
    return `Here's what MahaSafar covers:\n\n${cats}`;
  }

  // Default fallback
  return canAnswerMessage();
}

function greeting(): string {
  return `Namaste! 🙏 I'm the MahaSafar travel assistant, here to help you explore **Maharashtra**.\n\nI can help with:\n• Destination recommendations\n• Itinerary planning & trip budgets\n• Best time to visit\n• Hidden & offbeat spots\n• Beaches, forts, hill stations, wildlife & more\n\nWhat would you like to explore today?`;
}

function canAnswerMessage(): string {
  return `I'm MahaSafar's travel assistant for **Maharashtra**. Here's what I can help with:\n\n• 🗺 **Destinations** — ask about any place (Mahabaleshwar, Tarkarli, Tadoba…)\n• 🏔 **Categories** — hill stations, beaches, forts, temples, wildlife, heritage\n• 🗓 **Planning** — itineraries, budgets, best time to visit\n• ✦ **Hidden spots** — offbeat and lesser-known gems\n\nTry asking: "Plan a weekend trip from Pune" or "Best beach in Maharashtra".`;
}

// ─── Mode A: Supabase Edge Function ──────────────────────────────────────────

async function supabaseReply(messages: ChatMessage[]): Promise<string | null> {
  if (!supabase) return null;

  try {
    const payload = messages.slice(-10).map(({ role, content }) => ({ role, content }));
    const { data, error } = await supabase.functions.invoke<{ reply?: string }>('chat', {
      body: { messages: payload },
    });
    if (error) return null;
    const reply = typeof data?.reply === 'string' ? data.reply.trim() : '';
    return reply || null;
  } catch {
    return null;
  }
}

// ─── Public API ───────────────────────────────────────────────────────────────

export async function getChatReply(messages: ChatMessage[]): Promise<string> {
  // Mode A
  const aiReply = await supabaseReply(messages);
  if (aiReply) return aiReply;

  // Mode B — always succeeds
  await randomDelay();
  try {
    return localReply(messages);
  } catch {
    return 'The assistant is taking a break, please try again in a moment.';
  }
}

