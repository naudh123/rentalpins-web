import { describe, expect, it } from "vitest";
import { resizeImageForUpload } from "@/lib/image-resize";
import { withTimeout } from "@/lib/async-timeout";

describe("withTimeout", () => {
  it("resolves when promise finishes in time", async () => {
    await expect(withTimeout(Promise.resolve(42), 1000)).resolves.toBe(42);
  });

  it("rejects when promise exceeds deadline", async () => {
    await expect(
      withTimeout(
        new Promise((resolve) => setTimeout(() => resolve("late"), 50)),
        10,
        "too slow"
      )
    ).rejects.toThrow("too slow");
  });
});

describe("resizeImageForUpload", () => {
  it("returns small jpeg files unchanged", async () => {
    const file = new File([new Uint8Array(1000)], "room.jpg", {
      type: "image/jpeg",
    });
    const out = await resizeImageForUpload(file);
    expect(out).toBe(file);
  });

  it("rejects files above upload size limit", async () => {
    const file = new File([new Uint8Array(13 * 1024 * 1024)], "huge.jpg", {
      type: "image/jpeg",
    });
    await expect(resizeImageForUpload(file)).rejects.toThrow(/too large/i);
  });

  it("passes through non-image files", async () => {
    const file = new File([new Uint8Array(10)], "notes.txt", {
      type: "text/plain",
    });
    const out = await resizeImageForUpload(file);
    expect(out).toBe(file);
  });
});
