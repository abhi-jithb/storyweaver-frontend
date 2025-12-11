export function formatDate(dateString?: string): string {
  if (!dateString) return 'Unknown';
  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return 'Unknown';
  }
}

export function truncateText(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length) + '...';
}

export function getReadingLevelColor(level?: string): string {
  if (!level) return 'bg-gray-100 text-gray-700';
  
  const lower = level.toLowerCase();
  if (lower.includes('beginner') || lower.includes('1')) return 'bg-green-100 text-green-700';
  if (lower.includes('intermediate') || lower.includes('2')) return 'bg-blue-100 text-blue-700';
  if (lower.includes('advanced') || lower.includes('3')) return 'bg-purple-100 text-purple-700';
  
  return 'bg-gray-100 text-gray-700';
}