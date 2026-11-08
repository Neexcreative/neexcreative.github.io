/** Decorative Christmas details for the dark pine section: hanging baubles, pine sprigs and soft snow. */

const GOLD = "#e2c98f";
const RED = "#b8473f";
const CREAM = "#f3eadb";

function Bauble({ x, length, r, color, delay }: { x: number; length: number; r: number; color: string; delay: number }) {
  return (
    <g className="sf-sway" style={{ transformOrigin: `${x}px 0px`, animationDelay: `${delay}s` }}>
      <line x1={x} y1={0} x2={x} y2={length} stroke={GOLD} strokeOpacity=".55" strokeWidth="1" />
      <rect x={x - r * 0.28} y={length - 2} width={r * 0.56} height={r * 0.36} rx="1.5" fill={GOLD} />
      <circle cx={x} cy={length + r} r={r} fill={color} />
      <path
        d={`M ${x - r} ${length + r} Q ${x} ${length + r + r * 0.45} ${x + r} ${length + r}`}
        stroke={GOLD}
        strokeOpacity=".7"
        strokeWidth="1.2"
        fill="none"
      />
      <circle cx={x - r * 0.35} cy={length + r * 0.6} r={r * 0.22} fill="#fff" fillOpacity=".35" />
    </g>
  );
}

function Sprig({ flip = false }: { flip?: boolean }) {
  // A pine branch drawn from short needles along a gentle curve.
  const needles = Array.from({ length: 14 }, (_, i) => {
    const t = i / 13;
    const x = 10 + t * 170;
    const y = 20 + Math.sin(t * Math.PI) * 26;
    return (
      <g key={i}>
        <line x1={x} y1={y} x2={x - 10} y2={y - 16} stroke="#6f8f72" strokeWidth="2.4" strokeLinecap="round" />
        <line x1={x} y1={y} x2={x - 12} y2={y + 14} stroke="#58775b" strokeWidth="2.4" strokeLinecap="round" />
      </g>
    );
  });
  return (
    <svg
      viewBox="0 0 200 80"
      className={`h-auto w-[170px] md:w-[230px] ${flip ? "-scale-x-100" : ""}`}
      aria-hidden
      focusable="false"
    >
      <path d="M 4 22 Q 95 70 186 22" stroke="#4d6a50" strokeWidth="3" fill="none" strokeLinecap="round" />
      {needles}
      <circle cx="70" cy="46" r="5" fill={RED} />
      <circle cx="80" cy="44" r="4" fill={RED} />
      <circle cx="75" cy="52" r="4" fill="#9c3a33" />
    </svg>
  );
}

const snow = [
  [8, 22], [17, 64], [26, 38], [34, 80], [44, 14], [52, 56], [61, 30], [69, 74],
  [77, 46], [85, 18], [92, 62], [97, 36], [12, 88], [48, 92], [73, 90],
];

export default function ChristmasDecor() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <style>{`
        @keyframes sf-sway { 0%,100% { transform: rotate(-2.5deg) } 50% { transform: rotate(2.5deg) } }
        @media (prefers-reduced-motion: no-preference) { .sf-sway { animation: sf-sway 6s ease-in-out infinite } }
      `}</style>

      {/* soft snow */}
      {snow.map(([x, y], i) => (
        <span
          key={i}
          className="absolute rounded-full bg-white"
          style={{ left: `${x}%`, top: `${y}%`, width: i % 3 ? 3 : 5, height: i % 3 ? 3 : 5, opacity: 0.18 + (i % 4) * 0.06 }}
        />
      ))}

      {/* hanging baubles, top right */}
      <svg viewBox="0 0 260 130" className="absolute right-2 top-0 w-[190px] md:right-10 md:w-[260px]" focusable="false">
        <Bauble x={40} length={30} r={14} color={RED} delay={0} />
        <Bauble x={95} length={68} r={18} color={GOLD} delay={1.2} />
        <Bauble x={150} length={22} r={11} color={CREAM} delay={0.6} />
        <Bauble x={205} length={48} r={15} color={RED} delay={1.8} />
      </svg>

      {/* pine sprigs in the corners */}
      <div className="absolute -left-6 top-6 opacity-90">
        <Sprig />
      </div>
      <div className="absolute -bottom-2 -right-6 rotate-180 opacity-80">
        <Sprig flip />
      </div>

      {/* a small gold star */}
      <svg viewBox="0 0 24 24" className="absolute left-[46%] top-10 hidden w-5 md:block" focusable="false">
        <path d="M12 2l2.6 6.6L21 9.3l-5 4.4 1.6 6.8L12 17l-5.6 3.5L8 13.7 3 9.3l6.4-.7z" fill={GOLD} fillOpacity=".8" />
      </svg>
    </div>
  );
}
