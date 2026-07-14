import { STATUS_LABEL, type Project } from "@/lib/projects";
import { cn } from "@/lib/utils";
import Link from "next/link";

const statusClass: Record<string, string> = {
  live: "bg-emerald-500/15 text-emerald-200 border-emerald-400/30",
  beta: "bg-cyanGlow/15 text-cyanGlow border-cyanGlow/30",
  lab: "bg-violetGlow/15 text-violetGlow border-violetGlow/30",
  planned: "bg-white/10 text-white/55 border-white/15",
  external: "bg-gold/10 text-gold border-gold/25",
};

export default function ProjectCard({
  project,
  className,
}: {
  project: Project;
  className?: string;
}) {
  const inner = (
    <article
      className={cn(
        "glass-card flex h-full flex-col p-5 transition hover:border-cyanGlow/40",
        className
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-white/40">
          {project.kind}
        </p>
        <span
          className={cn(
            "shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase",
            statusClass[project.status]
          )}
        >
          {STATUS_LABEL[project.status]}
          {project.gated ? " · gated" : ""}
        </span>
      </div>
      <h3 className="mt-2 font-display text-lg font-semibold text-white">{project.name}</h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-white/60">{project.summary}</p>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {project.tags.map((t) => (
          <span key={t} className="rounded-md bg-white/5 px-2 py-0.5 text-[11px] text-white/45">
            {t}
          </span>
        ))}
      </div>
      <p className="mt-4 text-sm font-medium text-cyanGlow">
        {project.external || project.href.startsWith("http") ? "Open →" : "View →"}
      </p>
    </article>
  );

  if (project.href.startsWith("http")) {
    return (
      <a href={project.href} target="_blank" rel="noopener noreferrer" className="block h-full">
        {inner}
      </a>
    );
  }

  return (
    <Link href={project.href} className="block h-full">
      {inner}
    </Link>
  );
}
