import StructuredData from "@/components/seo/StructuredData";

interface Props {
  schemas: Record<string, unknown>[];
}

export default function SchemaJsonLd({ schemas }: Props) {
  if (!schemas.length) return null;
  return <StructuredData data={schemas} />;
}
