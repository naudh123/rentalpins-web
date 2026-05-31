"use client";

import RouteError from "@/components/RouteError";
import { appPath } from "@/lib/config";

interface Props {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ProfileError({ error, reset }: Props) {
  return (
    <RouteError
      title="Could not load profile"
      description="Your profile could not be loaded. Please try again."
      error={error}
      reset={reset}
      viewEvent="profile_error_viewed"
      retryEvent="profile_error_retry_clicked"
      backEvent="profile_error_back_clicked"
      backHref={appPath("/search")}
      backLabel="Back to map"
      context={{ route: "profile" }}
    />
  );
}
