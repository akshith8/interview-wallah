"use client";

import { useEffect, useRef, useState } from "react";
import { analyse, formatTime, splitFillers, type Analysis } from "@/lib/analyse";

const QUESTIONS = [
  "Tell me about yourself.",
  "Why do you want to work here?",
  "Describe a time you handled a difficult situation.",
  "What is your biggest weakness?",
];

/* Minimal typings for the browser Web Speech API (Chrome/Edge). */
interface SpeechRecognitionLike {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((e: { resultIndex: number; results: ArrayLike<{ isFinal: boolean; 0: { transcript: string } }> }) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
}

export default function PracticeDemo() {
  const [qIndex, setQIndex] = useState(0);
  const [recording, setRecording] = useState(false);
  const [supported, setSupported] = useState(true);
  const [text, setText] = useState("");
  const [seconds, setSeconds] = useState(0);
  const [result, setResult] = useState<Analysis | null>(null);

  const recRef = useRef<SpeechRecognitionLike | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const finalRef = useRef("");

  useEffect(() => {
    const w = window as unknown as Record<string, unknown>;
    setSupported(Boolean(w.SpeechRecognition || w.webkitSpeechRecognition));
    return () => {
      recRef.current?.stop();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  function start() {
    const w = window as unknown as Record<string, new () => SpeechRecognitionLike>;
    const Ctor = w.SpeechRecognition || w.webkitSpeechRecognition;
    if (!Ctor) return;
    setResult(null);
    setSeconds(0);
    setText("");
    finalRef.current = "";

    const rec = new Ctor();
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = "en-IN";
    rec.onresult = (e) => {
      let interim = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const r = e.results[i];
        if (r.isFinal) finalRef.current += r[0].transcript + " ";
        else interim += r[0].transcript;
      }
      setText((finalRef.current + interim).trim());
    };
    rec.onend = () => setRecording(false);
    rec.start();
    recRef.current = rec;
    setRecording(true);
    timerRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
  }

  function stop() {
    recRef.current?.stop();
    if (timerRef.current) clearInterval(timerRef.current);
    setRecording(false);
  }

  const hasText = text.trim().length > 0;

  return (
    <section id="practice" className="mx-auto max-w-4xl px-5 py-20">
      <h2 className="font-display text-4xl text-ink md:text-5xl">Try it now</h2>
      <p className="mt-3 text-ink/70">Pick a question, answer out loud, and see how you did.</p>

      <div className="mt-8 rounded-3xl border border-ink/10 bg-white/60 p-6 md:p-8">
        <div className="flex flex-wrap gap-2">
          {QUESTIONS.map((q, i) => (
            <button
              key={q}
              onClick={() => { setQIndex(i); setResult(null); }}
              disabled={recording}
              className={`rounded-full px-4 py-1.5 text-sm ${
                i === qIndex ? "bg-moss text-paper" : "border border-ink/20 hover:bg-ink/5"
              }`}
            >
              Q{i + 1}
            </button>
          ))}
        </div>
        <p className="mt-6 font-display text-3xl text-ink">{QUESTIONS[qIndex]}</p>

        <div className="mt-6 flex items-center gap-4">
          {supported ? (
            <button
              onClick={recording ? stop : start}
              className={`rounded-full px-6 py-3 font-medium text-paper ${
                recording ? "rec-live bg-clay" : "bg-moss hover:opacity-90"
              }`}
            >
              {recording ? "Stop recording" : "Start recording"}
            </button>
          ) : (
            <p className="text-sm text-ink/60">
              Voice input is not supported in this browser. Type your answer below and enter the time you took.
            </p>
          )}
          <span className="font-mono text-lg text-ink/70">{formatTime(seconds)}</span>
        </div>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          readOnly={recording}
          rows={5}
          placeholder="Your transcript will appear here..."
          className="mt-6 w-full rounded-xl border border-ink/20 bg-white/80 p-4 outline-none focus:border-moss"
        />

        {!supported && (
          <label className="mt-3 flex items-center gap-2 text-sm text-ink/70">
            Seconds taken:
            <input
              type="number"
              min={1}
              value={seconds || ""}
              onChange={(e) => setSeconds(Number(e.target.value))}
              className="w-24 rounded-lg border border-ink/20 px-3 py-1.5"
            />
          </label>
        )}

        <button
          onClick={() => setResult(analyse(text, seconds))}
          disabled={recording || !hasText}
          className="mt-6 rounded-full border border-moss px-6 py-2.5 font-medium text-moss hover:bg-moss hover:text-paper disabled:opacity-40"
        >
          Get feedback
        </button>

        {result && (
          <div className="mt-8 rounded-2xl bg-paper p-6">
            <div className="flex flex-wrap items-end gap-8">
              <div>
                <div className="font-display text-6xl text-moss">{result.score}</div>
                <div className="text-sm text-ink/60">out of 100</div>
              </div>
              <Stat label="Pace" value={`${result.wpm} wpm`} />
              <Stat label="Words" value={String(result.words)} />
              <Stat label="Fillers" value={String(result.fillers)} />
            </div>
            <p className="mt-6 leading-relaxed">
              {splitFillers(text).map((p, i) =>
                p.filler ? (
                  <mark key={i} className="rounded bg-clay/25 px-0.5">{p.text}</mark>
                ) : (
                  <span key={i}>{p.text}</span>
                )
              )}
            </p>
            <ul className="mt-6 list-disc space-y-2 pl-5 text-ink/80">
              {result.tips.map((t) => <li key={t}>{t}</li>)}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-2xl font-semibold">{value}</div>
      <div className="text-sm text-ink/60">{label}</div>
    </div>
  );
}
