"use client";

import RouteError from "@/components/RouteError";
import { appPath } from "@/lib/config";

interface Props {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ActivateError({ error, reset }: Props) {
  return (
    <RouteError
      title="Could not load activation"
      description="Something went wrong while loading plans and payment."
      error={error}
      reset={reset}
      viewEvent="post_activate_error_viewed"
      retryEvent="post_activate_error_retry_clicked"
      backEvent="post_activate_error_back_clicked"
      backHref={appPath("/profile")}
      backLabel="My listings"
      context={{ route: "post_activate" }}
    />
  );
}
