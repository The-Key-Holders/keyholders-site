import type { ForPackage, PackageValidation } from "./types";

export function validateForPackage(pkg: ForPackage): PackageValidation {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!pkg.cover.psapName.trim()) errors.push("PSAP name is required.");
  if (!pkg.cover.forDate.trim()) errors.push("FOR date is required.");
  if (!pkg.cover.advisorName.trim()) errors.push("Advisor name is required.");

  if (pkg.ops.pctAnswered15s != null) {
    if (pkg.ops.pctAnswered15s < 0 || pkg.ops.pctAnswered15s > 100) {
      errors.push("Speed of answer % must be between 0 and 100.");
    } else if (pkg.ops.pctAnswered15s < 90) {
      warnings.push(
        "ASA is below the 90% within 15 seconds standard — Section IV will include substandard discussion language."
      );
    }
  } else {
    warnings.push("Speed of answer % not entered — Section IV will use placeholders.");
  }

  if (pkg.network.totalLines != null && pkg.network.trunks911 != null) {
    if (pkg.network.trunks911 > pkg.network.totalLines) {
      warnings.push("911 trunks exceed total lines — verify network counts.");
    }
  }

  const requiredEvidenceMissing = pkg.evidence
    .filter((e) => e.required && !e.present)
    .map((e) => e.label);

  if (requiredEvidenceMissing.length) {
    warnings.push(
      `Required evidence not marked present: ${requiredEvidenceMissing.join("; ")}`
    );
  }

  return {
    ok: errors.length === 0,
    errors,
    warnings,
    requiredEvidenceMissing,
  };
}
