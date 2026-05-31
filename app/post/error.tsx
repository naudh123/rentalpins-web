"use client";

import RouteError from "@/components/RouteError";
import { appPath } from "@/lib/config";

interface Props {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function PostError({ error, reset }: Props) {
  return (
    <RouteError
      title="Could not load post listing"
      description="Something went wrong while loading the listing form."
      error={error}
      reset={reset}
      viewEvent="post_error_viewed"
      retryEvent="post_error_retry_clicked"
      backEvent="post_error_back_clicked"
      backHref={appPath("/profile")}
      backLabel="My profile"
      context={{ route: "post" }}
    />
  );
}
