export type Analysis = {
  score: number; // 0-100
  wpm: number; // words per minute
  words: number;
  fillers: number;
  tips: string[];
};

export type TextPart = { text: string; filler: boolean };

const FILLER_PHRASES = [
  "you know",
  "i mean",
  "sort of",
  "kind of",
  "basically",
  "actually",
  "literally",
  "umm",
  "uhh",
  "erm",
  "um",
  "uh",
  "er",
  "hmm",
  "like",
];

// Longest phrases first so "you know" wins over shorter matches.
const FILLER_PATTERN = FILLER_PHRASES.slice()
  .sort((a, b) => b.length - a.length)
  .map((p) => p.replace(/\s+/g, "\\s+"))
  .join("|");

// Capture group makes String.split keep the matched fillers in the result.
const SPLIT_REGEX = new RegExp(`\\b(${FILLER_PATTERN})\\b`, "gi");

export function formatTime(totalSeconds: number): string {
  const safe = Math.max(0, Math.floor(totalSeconds || 0));
  const m = Math.floor(safe / 60);
  const s = safe % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function splitFillers(text: string): TextPart[] {
  if (!text) return [];
  return text
    .split(SPLIT_REGEX)
    .map((chunk, i) => ({ text: chunk, filler: i % 2 === 1 }))
    .filter((p) => p.text.length > 0);
}

export function analyse(text: string, seconds: number): Analysis {
  const trimmed = text.trim();
  const words = trimmed ? trimmed.split(/\s+/).length : 0;
  const fillers = splitFillers(trimmed).filter((p) => p.filler).length;
  const wpm = seconds > 0 ? Math.round(words / (seconds / 60)) : 0;
  const fillerRate = words > 0 ? fillers / words : 0;

  let score = 100;
  const tips: string[] = [];

  // Pace: a comfortable speaking range is roughly 110-160 wpm.
  if (seconds > 0 && wpm < 110) {
    score -= Math.min(25, (110 - wpm) * 0.5);
    tips.push("You spoke a little slowly. Try to keep a steady, confident pace.");
  } else if (wpm > 170) {
    score -= Math.min(25, (wpm - 170) * 0.5);
    tips.push("You spoke quickly. Slow down and pause between key points.");
  }

  // Filler words.
  if (fillers > 0) {
    score -= Math.min(35, fillerRate * 100 * 4);
    if (fillerRate > 0.05) {
      tips.push(
        `You used ${fillers} filler words. Replace them with a short pause.`
      );
    } else {
      tips.push(`You used ${fillers} filler word(s). Nice and low, keep it up.`);
    }
  }

  // Answer length.
  if (words < 30) {
    score -= 20;
    tips.push("Your answer was very short. Aim for at least 30 to 60 seconds with an example.");
  } else if (words < 60) {
    score -= 10;
    tips.push("Add a specific example or result to make your answer stronger.");
  }

  if (tips.length === 0) {
    tips.push("Great answer! Clear pace, few fillers and a good length.");
  }

  return {
    score: Math.max(0, Math.min(100, Math.round(score))),
    wpm,
    words,
    fillers,
    tips,
  };
}
