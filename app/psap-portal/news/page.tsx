import { getNews } from "@/lib/psap-portal/store";
import { portal } from "@/lib/psap-portal/ui";
import Link from "next/link";

export default function NewsPage() {
  const news = getNews({ publishedOnly: true });
  return (
    <div className={portal.page}>
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className={portal.h1}>News &amp; alerts</h1>
          <p className={portal.lead}>Branch-confirmed transition messaging. Admins publish via Admin → News.</p>
        </div>
        <Link href="/psap-portal/admin" className="text-sm text-cyanGlow hover:underline">
          Admin →
        </Link>
      </div>
      <div className="mt-8 space-y-4">
        {news.map((n) => (
          <article key={n.id} className={portal.card}>
            <p className="text-xs text-white/40">{n.date}</p>
            <h2 className="mt-1 font-[family-name:var(--font-syne)] text-lg font-semibold text-white">
              {n.title}
            </h2>
            <p className={`${portal.muted} mt-2 whitespace-pre-wrap`}>{n.body}</p>
            {!!n.tags?.length && (
              <p className="mt-3 text-[11px] text-cyanGlow/80">{n.tags.join(" · ")}</p>
            )}
          </article>
        ))}
        {!news.length && <p className={portal.muted}>No published items yet.</p>}
      </div>
    </div>
  );
}
