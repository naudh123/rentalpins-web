import { ImageResponse } from "next/og";

export const alt = "RentalPins — map-first property discovery";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 72,
          background: "linear-gradient(135deg, #0a1628 0%, #1e3a6e 55%, #e8501a 100%)",
          color: "#FFFFFF",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div style={{ fontSize: 28, fontWeight: 600, opacity: 0.9 }}>RentalPins</div>
        <div style={{ marginTop: 16, fontSize: 56, fontWeight: 700, lineHeight: 1.1, maxWidth: 900 }}>
          Rent & buy property on the map
        </div>
        <div style={{ marginTop: 24, fontSize: 28, opacity: 0.88, maxWidth: 820 }}>
          Owner-direct rentals, resale, and new projects across India
        </div>
      </div>
    ),
    { ...size }
  );
}
