/* Speech analysis helpers (ported from lib/analyse.ts).
   Classic script (no ES modules) so the site also works when opened via file://. */
(function () {
  var FILLER_PHRASES = [
    "you know", "i mean", "sort of", "kind of", "basically", "actually", "literally",
    "umm", "uhh", "erm", "um", "uh", "er", "hmm", "like"
  ];

  // Longest phrases first so "you know" wins over shorter matches.
  var FILLER_PATTERN = FILLER_PHRASES.slice()
    .sort(function (a, b) { return b.length - a.length; })
    .map(function (p) { return p.replace(/\s+/g, "\\s+"); })
    .join("|");

  // Capture group makes String.split keep the matched fillers in the result.
  var SPLIT_REGEX = new RegExp("\\b(" + FILLER_PATTERN + ")\\b", "gi");

  function formatTime(totalSeconds) {
    var safe = Math.max(0, Math.floor(totalSeconds || 0));
    var m = Math.floor(safe / 60);
    var s = safe % 60;
    return m + ":" + String(s).padStart(2, "0");
  }

  function splitFillers(text) {
    if (!text) return [];
    return text
      .split(SPLIT_REGEX)
      .map(function (chunk, i) { return { text: chunk, filler: i % 2 === 1 }; })
      .filter(function (p) { return p.text.length > 0; });
  }

  function analyse(text, seconds) {
    var trimmed = text.trim();
    var words = trimmed ? trimmed.split(/\s+/).length : 0;
    var fillers = splitFillers(trimmed).filter(function (p) { return p.filler; }).length;
    var wpm = seconds > 0 ? Math.round(words / (seconds / 60)) : 0;
    var fillerRate = words > 0 ? fillers / words : 0;

    var score = 100;
    var tips = [];

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
        tips.push("You used " + fillers + " filler words. Replace them with a short pause.");
      } else {
        tips.push("You used " + fillers + " filler word(s). Nice and low, keep it up.");
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
      wpm: wpm,
      words: words,
      fillers: fillers,
      tips: tips
    };
  }

  window.Analyse = { analyse: analyse, formatTime: formatTime, splitFillers: splitFillers };
})();
