import { deleteNews, getNews, upsertNews } from "@/lib/psap-portal/store";
import type { NewsItem } from "@/lib/psap-portal/types";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const all = searchParams.get("all") === "1";
  return NextResponse.json({
    news: getNews({ publishedOnly: !all }),
  });
}

export async function POST(request: Request) {
  let body: Partial<NewsItem> = {};
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const title = String(body.title || "").trim();
  const bodyText = String(body.body || "").trim();
  if (!title || !bodyText) {
    return NextResponse.json({ error: "title and body required" }, { status: 400 });
  }
  const item: NewsItem = {
    id: body.id || `news-${Date.now()}`,
    title,
    body: bodyText,
    date: body.date || new Date().toISOString().slice(0, 10),
    tags: Array.isArray(body.tags) ? body.tags.map(String) : [],
    published: Boolean(body.published),
  };
  const news = upsertNews(item);
  return NextResponse.json({ news, item }, { status: 201 });
}

export async function PUT(request: Request) {
  return POST(request);
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "id required" }, { status: 400 });
  }
  const news = deleteNews(id);
  return NextResponse.json({ news });
}
