interface JsonLdProps {
  data: Record<string, unknown>;
}

/** Renders a schema.org JSON-LD block. Server-safe, no hydration cost. */
export default function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
