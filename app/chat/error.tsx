"use client";

import RouteError from "@/components/RouteError";
import { appPath } from "@/lib/config";

interface Props {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ChatError({ error, reset }: Props) {
  return (
    <RouteError
      title="Could not load chat"
      description="Messages could not be loaded. Please try again."
      error={error}
      reset={reset}
      viewEvent="chat_error_viewed"
      retryEvent="chat_error_retry_clicked"
      backEvent="chat_error_back_clicked"
      backHref={appPath("/search")}
      backLabel="Back to map"
      context={{ route: "chat" }}
    />
  );
}
