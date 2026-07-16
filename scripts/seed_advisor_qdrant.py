"""Seed local Qdrant collection advisor-docs with Manual markdown chunks."""

from __future__ import annotations

import hashlib
from pathlib import Path

from fastembed import TextEmbedding
from qdrant_client import QdrantClient
from qdrant_client.models import Distance, PointStruct, VectorParams

ROOT = Path(__file__).resolve().parents[1]
MD_DIR = ROOT / "lib" / "advisor-ai" / "knowledge" / "manual-md"
QPATH = Path.home() / ".grok" / "data" / "qdrant-advisor-ai"
COLLECTION = "advisor-docs"
MODEL = "sentence-transformers/all-MiniLM-L6-v2"
DIM = 384


def main() -> None:
    QPATH.mkdir(parents=True, exist_ok=True)
    client = QdrantClient(path=str(QPATH))
    embedder = TextEmbedding(model_name=MODEL)

    chunks: list[dict] = []
    for f in sorted(MD_DIR.glob("*.md")):
        if f.name.upper() == "README.MD":
            continue
        text = f.read_text(encoding="utf-8", errors="replace")
        size, overlap = 1200, 150
        for i in range(0, len(text), size - overlap):
            slice_ = text[i : i + size].strip()
            if len(slice_) < 150:
                continue
            chunks.append({"source": f.name, "offset": i, "text": slice_})

    print(f"chunks={len(chunks)}")
    if client.collection_exists(COLLECTION):
        client.delete_collection(COLLECTION)
    client.create_collection(
        collection_name=COLLECTION,
        vectors_config=VectorParams(size=DIM, distance=Distance.COSINE),
    )

    batch = 32
    points: list[PointStruct] = []
    for start in range(0, len(chunks), batch):
        batch_chunks = chunks[start : start + batch]
        vectors = list(embedder.embed([c["text"] for c in batch_chunks]))
        for c, vec in zip(batch_chunks, vectors):
            pid = int(
                hashlib.md5(f"{c['source']}:{c['offset']}".encode()).hexdigest()[:15],
                16,
            )
            points.append(
                PointStruct(
                    id=pid,
                    vector=list(vec),
                    payload={"source": c["source"], "text": c["text"][:4000]},
                )
            )
        print(f"embedded {min(start + batch, len(chunks))}/{len(chunks)}")

    for start in range(0, len(points), 64):
        client.upsert(collection_name=COLLECTION, points=points[start : start + 64])

    info = client.get_collection(COLLECTION)
    print(f"COLLECTION points={info.points_count}")
    client.close()
    print("SEED_OK")


if __name__ == "__main__":
    main()
