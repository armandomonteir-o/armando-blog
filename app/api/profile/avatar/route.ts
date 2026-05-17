import { NextResponse } from "next/server";
import { auth } from "@/auth";

const wpBase = process.env.WORDPRESS_API_URL
  ?.replace(/\/graphql\/?$/, "")
  .replace(/\/$/, "");

function getAuthHeader() {
  const user = process.env.WP_APP_USER;
  const pass = process.env.WP_APP_PASSWORD;
  if (!user || !pass) throw new Error("WP credentials not set");
  return `Basic ${Buffer.from(`${user}:${pass}`).toString("base64")}`;
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData().catch(() => null);
  const file = formData?.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Nenhum arquivo enviado" }, { status: 400 });
  }

  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "Apenas imagens são permitidas" }, { status: 400 });
  }

  if (file.size > 2 * 1024 * 1024) {
    return NextResponse.json({ error: "Imagem deve ter menos de 2MB" }, { status: 400 });
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");

    const res = await fetch(`${wpBase}/wp-json/wp/v2/media`, {
      method: "POST",
      headers: {
        Authorization: getAuthHeader(),
        "Content-Type": file.type,
        "Content-Disposition": `attachment; filename="${safeName}"`,
      },
      body: buffer,
    });

    if (!res.ok) {
      console.error("[POST /api/profile/avatar] WP error:", res.status, await res.text());
      return NextResponse.json({ error: "Falha ao fazer upload" }, { status: 500 });
    }

    const media = await res.json();
    return NextResponse.json({ url: media.source_url as string });
  } catch (err) {
    console.error("[POST /api/profile/avatar]", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
