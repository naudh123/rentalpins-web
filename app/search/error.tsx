"use client";

import RouteError from "@/components/RouteError";

interface Props {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function SearchError({ error, reset }: Props) {
  return (
    <RouteError
      title="Map search unavailable"
      description="We could not load the map. Check your connection and try again."
      error={error}
      reset={reset}
      viewEvent="search_error_viewed"
      retryEvent="search_error_retry_clicked"
      backEvent="search_error_back_home_clicked"
      backHref="/"
      backLabel="Back home"
      context={{ route: "search" }}
    />
  );
}
