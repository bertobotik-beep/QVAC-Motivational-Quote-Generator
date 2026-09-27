// QVAC Motivational Quote Generator — core logic.
// completion() writes a short, original, quotable line of motivation that
// references the user's actual struggle/goal — never a generic canned quote.

import { completion } from "@qvac/sdk";

const STOPWORDS = new Set([
  "the", "a", "an", "and", "or", "but", "of", "to", "in", "on", "for", "with",
  "my", "me", "i", "am", "is", "are", "was", "were", "be", "been", "being",
  "that", "this", "it", "at", "as", "so", "very", "really", "just", "not",
  "have", "has", "had", "will", "would", "can", "could", "about", "into",
  "up", "out", "getting", "trying", "want", "need",
]);

function keywords(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length >= 4 && !STOPWORDS.has(w));
}

function looksUnusable(text) {
  if (!text || text.trim().length === 0) return true;
  if (text.length > 260) return true;
  const bad = ["i cannot", "i can't", "as an ai", "i'm not able", "i do not have", "please provide"];
  const lower = text.toLowerCase();
  return bad.some((phrase) => lower.includes(phrase));
}

function isGrounded(text, situation) {
  const words = keywords(situation);
  if (words.length === 0) return true;
  const lower = text.toLowerCase();
  return words.some((w) => lower.includes(w));
}

const FALLBACK = (situation) =>
  `Every step you take toward "${situation}" is proof you haven't given up — keep going.`;

export async function generate(modelId, situation) {
  const run = completion({
    modelId,
    history: [
      {
        role: "system",
        content:
          "Write ONE short, original, quotable line of motivation (1 sentence, under 28 words) " +
          "that directly references the specific situation described by the user. It must read " +
          "like a genuine, shareable motivational quote grounded in their actual words — not a " +
          "generic saying that could apply to anything. Reply with ONLY the quote text, no preamble, " +
          "no quotation marks, no attribution, no explanation.",
      },
      { role: "user", content: "Struggle or goal: I'm trying to finish my first marathon next month but I keep getting injured." },
      { role: "assistant", content: "Your body is healing the very foundation that will carry you across that marathon finish line." },
      { role: "user", content: `Struggle or goal: ${situation}` },
    ],
    stream: true,
    completionOpts: { temperature: 0.8, maxTokens: 90 },
  });

  let text = "";
  for await (const token of run.tokenStream) text += token;
  text = text
    .trim()
    .replace(/^here'?s[^:\n]*:\s*/i, "")
    .trim()
    .split("\n")[0]
    .trim()
    .replace(/^["'“]|["'”]$/g, "")
    .trim();

  const quote = looksUnusable(text) || !isGrounded(text, situation) ? FALLBACK(situation) : text;
  return { quote };
}
