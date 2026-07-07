import AnimateIn from "@/components/AnimateIn";

interface JourneyStep {
  number: string;
  title: string;
  description: string;
}

/** The client journey the whole system is built around. */
const steps: JourneyStep[] = [
  {
    number: "01",
    title: "Strategy",
    description:
      "We start with your business, not a template — positioning, audience and the message that earns the first impression.",
  },
  {
    number: "02",
    title: "Design",
    description:
      "Identity, website and visual language built as one — consistent everywhere your customers meet the brand.",
  },
  {
    number: "03",
    title: "Content",
    description:
      "Video, photography and campaign assets that keep the brand alive and the story moving.",
  },
  {
    number: "04",
    title: "Distribution",
    description:
      "Social, ads and print carry the system into the world — and turn attention into enquiries.",
  },
];

export default function Journey() {
  return (
    <section aria-labelledby="journey-title" className="border-b border-border bg-surface">
      <div className="mx-auto max-w-7xl px-6 py-24 md:px-12 md:py-32">
        <AnimateIn>
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-accent">The Journey</p>
          <h2 id="journey-title" className="mt-4 max-w-2xl text-3xl font-semibold tracking-tight md:text-4xl">
            First impression → trust → conversion.
          </h2>
        </AnimateIn>

        <div className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <AnimateIn key={step.number} delay={index * 0.1}>
              <div className="border-t border-border pt-6">
                <span className="text-xs text-muted">{step.number}</span>
                <h3 className="mt-3 text-lg font-semibold">{step.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">{step.description}</p>
              </div>
            </AnimateIn>
          ))}
        </div>
      </div>
    </section>
  );
}
