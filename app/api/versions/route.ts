import { NextResponse } from "next/server";
import { getAllFileVersions, getFileVersion, type FileVersionId } from "@/lib/file-versions";

// GET /api/versions - queryable by agents/personas (e.g. error logging integrations, sub-agents, [reviewer])
// Returns all or filtered by ?id=...
// Uses local file metadata (lib/file-versions.ts). GitHub MCP used to maintain the hashes/commits externally.
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id") as FileVersionId | null;

  if (id) {
    const v = getFileVersion(id);
    if (!v) {
      return NextResponse.json({ error: "Unknown version id" }, { status: 404 });
    }
    return NextResponse.json({ version: v });
  }

  const versions = getAllFileVersions();
  return NextResponse.json({ versions, count: versions.length });
}
