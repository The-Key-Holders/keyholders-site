import { emptyForPackage, ENGINE_VERSION, suggestFiveYearEstimate } from "./defaults";
import {
  buildExportFiles,
  buildFullHtmlDocument,
  buildFullMarkdown,
  renderAllSections,
  type ExportFile,
} from "./render";
import type { ForPackage, PackageValidation, RenderedSection } from "./types";
import { validateForPackage } from "./validate";

export { ENGINE_VERSION, emptyForPackage, suggestFiveYearEstimate };
export type { ForPackage, PackageValidation, RenderedSection, ExportFile };
export {
  validateForPackage,
  renderAllSections,
  buildFullMarkdown,
  buildFullHtmlDocument,
  buildExportFiles,
};

export function assembleForPackage(
  pkg: ForPackage,
  opts?: { engine?: "web" | "desktop" }
): {
  package: ForPackage;
  validation: PackageValidation;
  sections: RenderedSection[];
  markdown: string;
  html: string;
  json: string;
  files: ExportFile[];
} {
  const assembled: ForPackage = {
    ...pkg,
    meta: {
      ...pkg.meta,
      version: ENGINE_VERSION,
      generatedAt: new Date().toISOString(),
      engine: opts?.engine ?? pkg.meta.engine ?? "web",
    },
    fiscal: {
      ...pkg.fiscal,
      fiveYearEstimate:
        pkg.fiscal.fiveYearEstimate != null
          ? pkg.fiscal.fiveYearEstimate
          : suggestFiveYearEstimate(pkg),
    },
  };

  const validation = validateForPackage(assembled);
  const sections = renderAllSections(assembled);
  return {
    package: assembled,
    validation,
    sections,
    markdown: buildFullMarkdown(assembled),
    html: buildFullHtmlDocument(assembled),
    json: JSON.stringify(assembled, null, 2),
    files: buildExportFiles(assembled),
  };
}
