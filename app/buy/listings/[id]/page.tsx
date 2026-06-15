import ListingDetailRoute, {
  generateMetadata,
} from "@/components/listings/ListingDetailRoute";

export { generateMetadata };

export default function BuyListingDetailPage(
  props: React.ComponentProps<typeof ListingDetailRoute>
) {
  return <ListingDetailRoute {...props} channel="buy" />;
}
