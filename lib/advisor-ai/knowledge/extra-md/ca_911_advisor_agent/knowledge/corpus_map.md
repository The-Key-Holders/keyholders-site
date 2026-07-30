# Corpus map (F: drive grounding)

## Include for knowledge and RAG

| Path | Use |
|------|-----|
| `F:\operations_manual_export\` | Policy PDFs (Intro, Ch I–XII, Glossary, Funding ADA) |
| `F:\Advisor_User_Manual\` | Manual, Quick Aids, source_extracts, portal kit |
| `F:\Advisor_Docs\TRAINING\` | Desk manual, CPE training, acronyms |
| `F:\Advisor_Docs\RESOURCES\` | Forms templates, CPE procurement, ATA, NG |
| `F:\Advisor_Docs\FISCAL&OPERATIONAL REVIEW (FOR)\` | FOR templates/instructions |
| `F:\Advisor_Docs\Advisor County Assignments\` | Routing workbooks |
| `F:\CPE_Funding_Fixed_Allotment_Calculator\` | Calculator + formula docs |
| `F:\Assigned_PSAP_Files_Javad\` | Assignment pointer workbook |

## Sample only

| Path | Rule |
|------|------|
| `F:\Advisor_PSAP_Files\` | County/PSAP folder shape; do not bulk-index all counties |

## Red zones

| Path / type | Rule |
|-------------|------|
| `F:\Outlook_Emails\` | Do not bulk-load |
| `F:\Onboarding_Docs\` | PII risk |
| Secrets, `.env`, keys | Never |
| Full recursive PSAP file contents | Avoid |

## Conflict priority

Live Manual → Branch memo → newest extract in this repo → Quick Aids → older desk manual.
