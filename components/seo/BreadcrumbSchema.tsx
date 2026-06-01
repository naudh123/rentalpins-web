import { JsonLdBreadcrumb } from "@/components/JsonLd";

export { JsonLdBreadcrumb as BreadcrumbSchema };

interface Item {
  name: string;
  url: string;
}

export default function BreadcrumbSchema({ items }: { items: Item[] }) {
  return <JsonLdBreadcrumb items={items} />;
}
