/**
 * Resolves the official logo for a government regulatory authority.
 * Uses custom logo_url if provided in DB; returns null if empty so user can upload themselves.
 */
export function getPortalLogo(portal: {
  logo_url?: string | null;
}): string | null {
  if (portal.logo_url && portal.logo_url.trim()) {
    return portal.logo_url.trim();
  }
  return null;
}
