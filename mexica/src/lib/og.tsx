import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

const buffer = (b: Buffer) => b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength);

/** The branded 1200×630 social card shared by every page: orange field, chunky headline, a plate of tacos. */
export async function brandCard({ eyebrow, title, plate = "tacos" }: { eyebrow: string; title: string; plate?: string }) {
  const [crnch, body, photo] = await Promise.all([
    readFile(join(process.cwd(), "public/fonts/og-crnch-artwork.otf")),
    readFile(join(process.cwd(), "public/fonts/og-geist-regular.ttf")),
    readFile(join(process.cwd(), "public/images/plates", `${plate.replace(/[^a-z-]/g, "")}.jpg`)),
  ]);
  const size = title.length > 60 ? 60 : title.length > 40 ? 70 : 90;
  return new ImageResponse(
    (
      <div style={{ display: "flex", width: "100%", height: "100%", background: "#f15a28", color: "#f8f1e9", fontFamily: "Geist" }}>
        {/* @ts-expect-error Satori accepts an ArrayBuffer for <img src> at runtime */}
        <img src={buffer(photo)} width={520} height={520} style={{ position: "absolute", right: -70, top: 55, borderRadius: 999, boxShadow: "0 24px 40px rgba(29,26,23,.35)" }} alt="" />
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: 720, padding: "56px 0 52px 64px" }}>
          <div style={{ display: "flex", fontSize: 22, letterSpacing: 3, textTransform: "uppercase", color: "#ffc629" }}>{eyebrow}</div>
          <div style={{ display: "flex", fontFamily: "Crnch, Geist", fontSize: size, lineHeight: 0.95, textTransform: "uppercase" }}>{title}</div>
          <div style={{ display: "flex", alignItems: "center", gap: 18, fontSize: 24 }}>
            <span style={{ display: "flex", background: "#231f20", color: "#f8f1e9", borderRadius: 999, padding: "10px 24px" }}>Bella Cucina Mexican</span>
            <span>Locust Grove, Virginia</span>
          </div>
        </div>
      </div>
    ),
    {
      ...ogSize,
      fonts: [
        { name: "Crnch", data: crnch, style: "normal", weight: 400 },
        { name: "Geist", data: body, style: "normal", weight: 400 },
      ],
    },
  );
}
