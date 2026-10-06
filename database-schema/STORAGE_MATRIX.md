# Storage bucket matrix

| Bucket | Purpose | Visibility | Allowed types | Size | Upload/read policy |
|---|---|---|---|---:|---|
| `website-media` | Published CMS images and media | Public | Images and approved CMS media | 10 MB | Staff/admin upload through protected route; public read only for published references. |
| `download-resources` | Published resource documents | Public | PDF | 10 MB | Staff/admin upload through protected route; public read/download for published records. |
| `application-cvs` | Applicant CVs | Private | PDF, DOC, DOCX | 10 MB | Public submission only through validated application API; staff/admin signed retrieval only. |

The configured project was inspected on 2026-10-07: only `website-media` existed and it was public with a 10 MB limit. The two missing purpose-specific buckets are declared in `20261007_security_content_integrity.sql`; apply that migration only after confirming the target is the intended staging/project environment.
