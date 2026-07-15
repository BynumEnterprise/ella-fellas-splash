import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const rawTitle = searchParams.get("title") ?? "Ella Fellas";
  const title = rawTitle.slice(0, 120);
  const kicker = (searchParams.get("kicker") ?? "THE UNOFFICIAL ELLA LANGLEY SUPERFAN HQ").slice(0, 60);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#2F4858",
          backgroundImage: "linear-gradient(135deg, #2F4858 0%, #22354a 60%, #1b2b3d 100%)",
          padding: "64px 72px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", color: "#D9A441", fontSize: 28, letterSpacing: 6, fontWeight: 700 }}>
            ELLA FELLAS
          </div>
          <div style={{ display: "flex", color: "#FAF7F0", opacity: 0.65, fontSize: 18, letterSpacing: 3, marginTop: 8 }}>
            {kicker}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            color: "#FAF7F0",
            fontSize: title.length > 70 ? 52 : 64,
            fontWeight: 800,
            lineHeight: 1.15,
            maxWidth: 1000,
          }}
        >
          {title}
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", color: "#D9A441", fontSize: 22, fontWeight: 700 }}>
            ellafellas.com
          </div>
          <div style={{ display: "flex", color: "#FAF7F0", opacity: 0.5, fontSize: 18 }}>
            Tour dates - setlists - concert prep
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
