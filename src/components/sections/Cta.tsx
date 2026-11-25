"use client";

import { useState } from "react";
import { postContact } from "@/lib/api";

export default function Cta() {
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    setStatus("sending");
    try {
      await postContact({
        name: String(fd.get("name") ?? ""),
        email: String(fd.get("email") ?? ""),
        message: String(fd.get("message") ?? ""),
      });
      setStatus("done");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  const field = "w-full rounded-lg border border-ink/20 bg-white/70 px-4 py-3 outline-none focus:border-moss";

  return (
    <section id="contact" className="mx-auto max-w-2xl px-5 py-20 text-center">
      <h2 className="font-display text-4xl text-ink md:text-5xl">Get early access</h2>
      <p className="mt-3 text-ink/70">Leave your details and we will get in touch.</p>
      <form onSubmit={onSubmit} className="mt-8 space-y-4 text-left">
        <input name="name" required placeholder="Your name" className={field} />
        <input name="email" type="email" required placeholder="Email" className={field} />
        <textarea name="message" rows={3} placeholder="Anything you'd like to tell us? (optional)" className={field} />
        <button
          disabled={status === "sending"}
          className="w-full rounded-full bg-moss px-6 py-3 font-medium text-paper hover:opacity-90 disabled:opacity-60"
        >
          {status === "sending" ? "Sending..." : "Join the list"}
        </button>
        {status === "done" && <p className="text-center text-moss">Thanks! We will be in touch.</p>}
        {status === "error" && (
          <p className="text-center text-clay">Could not send. Check that the backend is running.</p>
        )}
      </form>
    </section>
  );
}