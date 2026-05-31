"use client";

import RouteError from "@/components/RouteError";
import { appPath } from "@/lib/config";

interface Props {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function SavedSearchesError({ error, reset }: Props) {
  return (
    <RouteError
      title="Could not load saved searches"
      description="Your saved searches could not be loaded. Please try again."
      error={error}
      reset={reset}
      viewEvent="saved_search_page_error_viewed"
      retryEvent="saved_search_page_error_retry_clicked"
      backEvent="saved_search_page_error_back_clicked"
      backHref={appPath("/search")}
      backLabel="Back to map"
      context={{ route: "saved-searches" }}
    />
  );
}
