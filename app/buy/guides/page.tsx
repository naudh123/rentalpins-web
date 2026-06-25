import { redirect } from "next/navigation";
import { appPath } from "@/lib/config";

/** Alias — buy editorial hub lives at /blog/buy. */
export default function BuyGuidesPage() {
  redirect(appPath("/blog/buy"));
}
