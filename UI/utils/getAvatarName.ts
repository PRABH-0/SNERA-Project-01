export function getAvatarName(fullName: string | undefined | null): string {
  if (!fullName) return "";

  const cleaned = fullName.trim();

  if (!cleaned) return "";

  const parts = cleaned.split(" ").filter(Boolean);

  // Single word → first letter
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }

  // Multiple words → first + last
  const first = parts[0].charAt(0).toUpperCase();
  const last = parts[parts.length - 1].charAt(0).toUpperCase();

  return first + last;
}
