"use client";

import { useEffect, useState } from "react";

/** Shown above the plans when someone comes back from Stripe without paying (?checkout=cancelled). */
export default function CheckoutNotice() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("checkout") !== "cancelled") return;
    // Reading the URL once on mount is the point here; there is no external store to subscribe to.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setShow(true);
    params.delete("checkout");
    const query = params.toString();
    window.history.replaceState(null, "", `${window.location.pathname}${query ? `?${query}` : ""}${window.location.hash}`);
  }, []);

  if (!show) return null;
  return (
    <div role="status" className="mx-auto mb-8 flex max-w-2xl items-start gap-3 rounded-2xl bg-[#fbe9e5] px-5 py-4 text-[15px] text-[#3b2a24]">
      <span aria-hidden className="text-[#7a2e2a]">●</span>
      <p className="flex-1">
        <strong className="font-semibold">Checkout cancelled, nothing was charged.</strong> Take your time. Your plan is
        still here whenever you&apos;re ready.
      </p>
      <button type="button" onClick={() => setShow(false)} className="text-[#6f5a52] hover:text-[#3b2a24]" aria-label="Dismiss">
        ×
      </button>
    </div>
  );
}
