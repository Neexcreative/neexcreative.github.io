"use client";

import { useState, type FormEvent } from "react";
import { quoteServiceOptions, siteConfig } from "@/lib/site-config";

type SubmitStatus = "idle" | "sending" | "sent" | "error";

/**
 * Quote request form ported from the legacy contact page.
 * Submits to a Formspree-compatible endpoint (NEXT_PUBLIC_FORM_ENDPOINT).
 * Until that env var is configured, it falls back to opening the visitor's
 * email client with the enquiry pre-filled — unlike the legacy mailto form
 * action, which silently dropped submissions.
 */
const FORM_ENDPOINT = process.env.NEXT_PUBLIC_FORM_ENDPOINT;

const inputClasses =
  "w-full border border-border bg-surface px-4 py-3 text-sm text-text placeholder:text-muted focus:border-accent focus:outline-none";
const labelClasses = "text-xs font-medium uppercase tracking-[0.18em] text-muted";

export default function ContactForm() {
  const [status, setStatus] = useState<SubmitStatus>("idle");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    if (!FORM_ENDPOINT) {
      // Fallback: open the visitor's mail client with the enquiry pre-filled.
      const lines = ["full_name", "email", "phone", "location", "service", "project_details", "message"]
        .map((field) => `${field.replace("_", " ")}: ${String(data.get(field) ?? "")}`)
        .join("\n");
      const subject = encodeURIComponent("New quote request from Neex Creative website");
      window.location.href = `mailto:${siteConfig.email}?subject=${subject}&body=${encodeURIComponent(lines)}`;
      return;
    }

    setStatus("sending");
    try {
      const response = await fetch(FORM_ENDPOINT, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });
      if (!response.ok) throw new Error(`Form endpoint returned ${response.status}`);
      form.reset();
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={handleSubmit} aria-describedby="form-reply-note" noValidate={false}>
      <div className="flex items-baseline justify-between gap-4 border-b border-border pb-5">
        <h2 className="text-xs font-medium uppercase tracking-[0.22em]">Request a Free Quote</h2>
        <p id="form-reply-note" className="text-xs text-muted">
          Typically replied within 24 hours
        </p>
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label className={labelClasses} htmlFor="full-name">
            Full Name <span className="text-accent" aria-hidden>*</span>
          </label>
          <input
            className={inputClasses}
            type="text"
            id="full-name"
            name="full_name"
            placeholder="Your full name"
            autoComplete="name"
            required
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className={labelClasses} htmlFor="email">
            Email Address <span className="text-accent" aria-hidden>*</span>
          </label>
          <input
            className={inputClasses}
            type="email"
            id="email"
            name="email"
            placeholder="you@example.com"
            autoComplete="email"
            required
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className={labelClasses} htmlFor="phone">
            Phone Number
          </label>
          <input
            className={inputClasses}
            type="tel"
            id="phone"
            name="phone"
            placeholder={siteConfig.phone}
            autoComplete="tel"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className={labelClasses} htmlFor="location">
            Your Location
          </label>
          <input
            className={inputClasses}
            type="text"
            id="location"
            name="location"
            placeholder="City or county"
          />
        </div>

        <div className="flex flex-col gap-2 sm:col-span-2">
          <label className={labelClasses} htmlFor="service">
            Service Required <span className="text-accent" aria-hidden>*</span>
          </label>
          <select className={inputClasses} id="service" name="service" required defaultValue="">
            <option value="" disabled>
              Select a service...
            </option>
            {quoteServiceOptions.map((group) => (
              <optgroup key={group.label} label={group.label}>
                {group.options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-2 sm:col-span-2">
          <label className={labelClasses} htmlFor="project-details">
            Project Details
          </label>
          <input
            className={inputClasses}
            type="text"
            id="project-details"
            name="project_details"
            placeholder="e.g. New restaurant website with online booking - 5 pages"
          />
        </div>

        <div className="flex flex-col gap-2 sm:col-span-2">
          <label className={labelClasses} htmlFor="message">
            Your Message <span className="text-accent" aria-hidden>*</span>
          </label>
          <textarea
            className={`${inputClasses} min-h-32 resize-y leading-relaxed`}
            id="message"
            name="message"
            placeholder="Tell us about your project - the more detail the better. Include any inspiration, deadlines or specific requirements."
            required
          />
        </div>
      </div>

      <p className="mt-6 text-xs leading-relaxed text-muted">
        Your information is kept strictly private and will only be used to
        respond to your enquiry. We never share your details with third
        parties.
      </p>

      <button
        type="submit"
        disabled={status === "sending"}
        className="mt-6 inline-flex w-full items-center justify-center gap-2 bg-accent px-7 py-4 text-xs font-medium uppercase tracking-[0.18em] text-text transition-opacity hover:opacity-85 disabled:opacity-50"
      >
        {status === "sending" ? "Sending…" : "Request My Free Quote"}
        <span aria-hidden>→</span>
      </button>

      <p role="status" aria-live="polite" className="mt-4 text-sm">
        {status === "sent" && (
          <span className="text-text">
            Thanks — your enquiry is on its way. We&apos;ll reply within 24 hours.
          </span>
        )}
        {status === "error" && (
          <span className="text-accent">
            Something went wrong sending the form. Please email us directly at{" "}
            <a className="underline underline-offset-4" href={`mailto:${siteConfig.email}`}>
              {siteConfig.email}
            </a>
            .
          </span>
        )}
      </p>
    </form>
  );
}
