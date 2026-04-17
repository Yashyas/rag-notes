export function sanitizeContent(text: string): string {
  if (!text) return '';

  return text
    // 1. Remove Markdown images: ![alt text](url)
    .replace(/!\[.*?\]\(.*?\)/g, '')
    // 2. Remove empty Markdown links left behind: [](url)
    .replace(/\[\s*\]\(.*?\)/g, '')
    // 3. Optional: Remove standard HTML image tags if the scraper missed them
    .replace(/<img[^>]*>/g, '')
    // 4. Collapse multiple spaces, tabs, or newlines into a single space
    .replace(/\s+/g, ' ')
    .trim();
}