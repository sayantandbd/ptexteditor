export function getTitleFromContent(content) {
  if (!content) return 'Untitled';

  const firstLine = content.split('\n')[0].trim().slice(0, 25);
  const words = firstLine.split(/\s+/).slice(0, 5); // max 5 words
  return words.join(' ') || 'Untitled';
}
