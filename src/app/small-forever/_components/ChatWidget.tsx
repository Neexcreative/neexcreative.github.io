"use client";

import { useEffect, useRef, useState } from "react";
import { trackContact } from "@/lib/tracking";

interface Faq {
  question: string;
  answer: string;
}

type Message = { from: "us" | "you"; text: string };

/**
 * Small Forever help bubble. Quick questions answer instantly from the FAQ;
 * anything else is handed over to WhatsApp with the visitor's text pre-filled.
 * Nothing is stored or sent anywhere until the visitor opens WhatsApp.
 */
export default function ChatWidget({ whatsappUrl, faqs }: { whatsappUrl: string; faqs: Faq[] }) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { from: "us", text: "Hi! I'm Marlon, the dad behind Small Forever. Ask me anything, or pick a question below." },
  ]);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open]);

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const ask = (faq: Faq) =>
    setMessages((m) => [...m, { from: "you", text: faq.question }, { from: "us", text: faq.answer }]);

  const waLink = (text: string) => `${whatsappUrl}?text=${encodeURIComponent(text || "Hi! I have a question about Small Forever.")}`;

  const send = (e: React.FormEvent) => {
    e.preventDefault();
    const text = draft.trim();
    trackContact("whatsapp");
    window.open(waLink(text), "_blank", "noopener,noreferrer");
    if (text) setMessages((m) => [...m, { from: "you", text }, { from: "us", text: "Opening WhatsApp so we can reply to you personally." }]);
    setDraft("");
  };

  const quick = faqs.slice(0, 4);

  return (
    <div className="fixed bottom-4 right-4 z-40 flex flex-col items-end gap-3 md:bottom-6 md:right-6">
      {open && (
        <div
          role="dialog"
          aria-label="Questions about Small Forever"
          className="flex h-[min(520px,75vh)] w-[min(360px,calc(100vw-2rem))] flex-col overflow-hidden rounded-3xl border border-[#e8d9cf] bg-[#fbf7f2] shadow-[0_30px_60px_-20px_rgba(46,32,28,0.45)]"
        >
          <div className="flex items-center justify-between bg-[#3a2722] px-5 py-4 text-white">
            <div>
              <p className="sf-serif text-lg leading-none">Small Forever</p>
              <p className="mt-1 text-xs text-[#e6d5cb]">We usually reply within a few hours</p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-full p-1.5 text-xl leading-none text-white/80 hover:bg-white/10 hover:text-white"
              aria-label="Close chat"
            >
              ×
            </button>
          </div>

          <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4 text-[14px] leading-relaxed" aria-live="polite">
            {messages.map((m, i) => (
              <p
                key={i}
                className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 ${
                  m.from === "us" ? "rounded-tl-sm bg-white text-[#3b2a24] shadow-sm" : "ml-auto rounded-tr-sm bg-[#7a2e2a] text-white"
                }`}
              >
                {m.text}
              </p>
            ))}
            <div className="flex flex-wrap gap-2 pt-1">
              {quick.map((f) => (
                <button
                  key={f.question}
                  type="button"
                  onClick={() => ask(f)}
                  className="rounded-full border border-[#e8d9cf] bg-white px-3 py-1.5 text-left text-[13px] text-[#3b2a24] hover:border-[#7a2e2a]"
                >
                  {f.question}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={send} className="flex items-center gap-2 border-t border-[#e8d9cf] bg-white p-3">
            <label htmlFor="sf-chat-input" className="sr-only">
              Your question
            </label>
            <input
              id="sf-chat-input"
              ref={inputRef}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Type your question…"
              className="min-w-0 flex-1 rounded-full border border-[#e8d9cf] px-4 py-2.5 text-[14px] text-[#3b2a24] outline-none focus:border-[#7a2e2a]"
            />
            <button type="submit" className="whitespace-nowrap rounded-full bg-[#25D366] px-4 py-2.5 text-[13px] font-semibold text-[#073b1d] hover:bg-[#20bd5b]">
              WhatsApp
            </button>
          </form>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={open ? "Close questions" : "Questions? Chat with us"}
        className="flex items-center gap-2 rounded-full bg-[#3a2722] py-3 pl-4 pr-5 text-sm font-semibold text-white shadow-[0_18px_40px_-12px_rgba(46,32,28,0.6)] transition-transform hover:scale-[1.03]"
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
          <path d="M4 5h16v11H8l-4 4z" strokeLinejoin="round" />
        </svg>
        {open ? "Close" : "Questions?"}
      </button>
    </div>
  );
}
