# Storage bucket matrix

| Bucket | Purpose | Visibility | Allowed types | Size | Upload/read policy |
|---|---|---|---|---:|---|
| `website-media` | Published CMS images and media | Public | JPEG, PNG, WebP, GIF, PDF, DOC, DOCX | 10 MB | Staff/admin upload through protected route; public read only for published references. |
| `download-resources` | Published resource documents | Public | PDF, DOC, DOCX, XLS, XLSX, ZIP | 10 MB | Staff/admin upload through protected route; public read/download for published records. |
| `application-cvs` | Applicant CVs | Private | PDF, DOC, DOCX | 10 MB | Public submission only through validated application API; staff/admin signed retrieval only. |

The configured Supabase project was inspected and updated on 2026-10-10. All three buckets use 10 MB limits and match the intended visibility. The live `website-media` bucket no longer permits SVG; its remaining allowed MIME types match the table above. An object inventory found no existing SVG files. The `government_links` table now includes `logo_url` and `logo_alt`. `application-cvs` is private; the two content buckets are public-read. Upload and deletion remain server-side staff operations.
