// Format a byte count into a human-readable size (e.g. 272730423296 -> "254 GB").
export function formatBytes(bytes) {
  if (bytes == null || isNaN(bytes) || bytes <= 0) return null;
  const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
  const i = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / Math.pow(1024, i);
  const rounded = value >= 100 || i === 0 ? Math.round(value) : value.toFixed(1);
  return `${rounded} ${units[i]}`;
}

// Resolve tags from a `tags` field (array or comma-separated string),
// falling back to the "Tags:" line embedded in the description.
export function getTags(pkg) {
  if (Array.isArray(pkg.tags)) {
    return pkg.tags.map(t => String(t).trim()).filter(Boolean);
  }
  if (typeof pkg.tags === 'string') {
    return splitTags(pkg.tags);
  }
  const match = (pkg.description || '').match(/^\s*Tags:\s*(.+)$/im);
  return match ? splitTags(match[1]) : [];
}

function splitTags(str) {
  return str
    .split(',')
    .map(t => t.trim())
    .filter(Boolean);
}
