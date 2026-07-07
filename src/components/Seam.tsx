interface SeamProps {
  direction: "darkToLight" | "lightToDark";
}

/**
 * Palette transition band. A short vertical fade between the dark ground
 * and the warm off-white so palette changes read as a deliberate dissolve,
 * not a hard cut. Purely decorative.
 */
export default function Seam({ direction }: SeamProps) {
  return (
    <div
      aria-hidden
      className={`h-24 md:h-36 ${
        direction === "darkToLight"
          ? "bg-gradient-to-b from-bg to-light-bg"
          : "bg-gradient-to-b from-light-bg to-bg"
      }`}
    />
  );
}
