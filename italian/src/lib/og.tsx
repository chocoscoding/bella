import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

/** The branded 1200×630 social card shared by every page: red field, yellow headline, the pizza on its fork. */
export async function brandCard({ eyebrow, title }: { eyebrow: string; title: string }) {
  const [krisha, jua, pizza] = await Promise.all([
    readFile(join(process.cwd(), "public/fonts/Krisha-Regular.otf")),
    readFile(join(process.cwd(), "public/fonts/Jua-Regular.ttf")),
    readFile(join(process.cwd(), "public/images/hero-pizza-fork.png")),
  ]);
  const size = title.length > 60 ? 70 : title.length > 40 ? 84 : 100;
  return new ImageResponse(
    (
      <div style={{ display: "flex", width: "100%", height: "100%", background: "#d32618", color: "#f3e8cc", fontFamily: "Jua" }}>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: 860, padding: "58px 0 52px 64px" }}>
          <div style={{ display: "flex", fontSize: 24, letterSpacing: 4, textTransform: "uppercase" }}>{eyebrow}</div>
          <div style={{ display: "flex", fontFamily: "Krisha", fontSize: size, lineHeight: 0.95, textTransform: "uppercase", color: "#ffca26" }}>{title}</div>
          <div style={{ display: "flex", alignItems: "center", gap: 18, fontSize: 26 }}>
            <span style={{ display: "flex", background: "#ffca26", color: "#d32618", borderRadius: 999, padding: "8px 22px" }}>Bella Cucina of the Lake</span>
            <span>Locust Grove, Virginia</span>
          </div>
        </div>
        {/* @ts-expect-error Satori accepts an ArrayBuffer for <img src> at runtime */}
        <img src={pizza.buffer.slice(pizza.byteOffset, pizza.byteOffset + pizza.byteLength)} width={360} height={566} style={{ position: "absolute", right: 0, bottom: -8 }} alt="" />
      </div>
    ),
    {
      ...ogSize,
      fonts: [
        { name: "Krisha", data: krisha, style: "normal", weight: 400 },
        { name: "Jua", data: jua, style: "normal", weight: 400 },
      ],
    },
  );
}
