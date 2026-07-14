import Footer from "@/components/Footer";
import ProjectCard from "@/components/ProjectCard";
import { projects, type ProjectKind } from "@/lib/projects";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Full Key Holders portfolio — ventures, Advisor Tools, labs, and integrations.",
};

const KINDS: { id: ProjectKind | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "venture", label: "Ventures" },
  { id: "tool", label: "Tools" },
  { id: "lab", label: "Labs" },
  { id: "integration", label: "Integrations" },
  { id: "template", label: "Templates" },
];

export default function ProjectsPage({
  searchParams,
}: {
  searchParams?: { kind?: string };
}) {
  const kind = (searchParams?.kind as ProjectKind | "all" | undefined) || "all";
  const list =
    kind === "all" ? projects : projects.filter((p) => p.kind === kind);

  return (
    <>
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
        <p className="text-sm font-medium uppercase tracking-widest text-cyanGlow/80">Portfolio</p>
        <h1 className="mt-2 font-display text-4xl font-bold text-white">Projects</h1>
        <p className="mt-4 max-w-2xl text-white/65">
          Curated inventory of Key Holders ventures, professional tools (some sign-in), and labs.
          One catalog powers this page and the homepage — ship something new, update the catalog once.
        </p>

        <div className="mt-8 flex flex-wrap gap-2">
          {KINDS.map((k) => {
            const active = kind === k.id;
            const href = k.id === "all" ? "/projects" : `/projects?kind=${k.id}`;
            return (
              <a
                key={k.id}
                href={href}
                className={
                  active
                    ? "rounded-full bg-cyanGlow/15 px-3 py-1.5 text-sm font-medium text-cyanGlow"
                    : "rounded-full border border-white/10 px-3 py-1.5 text-sm text-white/55 hover:border-white/25"
                }
              >
                {k.label}
              </a>
            );
          })}
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </div>
      </div>
      <Footer variant="parent" />
    </>
  );
}
