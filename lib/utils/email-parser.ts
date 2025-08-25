// Utility functions for parsing and sanitizing email content

export function sanitizeEmailContent(content: string): string {
  // Remove potentially dangerous HTML tags and scripts
  const dangerousTags = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi
  const cleanContent = content.replace(dangerousTags, "")

  // Limit content length to prevent abuse
  const maxLength = 50000 // 50KB limit
  if (cleanContent.length > maxLength) {
    return cleanContent.substring(0, maxLength) + "\n\n[Content truncated due to length]"
  }

  return cleanContent
}

export function extractPlainTextFromHtml(html: string): string {
  // Simple HTML to text conversion
  // In production, consider using a proper HTML parser like jsdom
  return html
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim()
}

export function validateEmailAddress(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function isValidBonsamtiEmail(email: string): boolean {
  return email.endsWith("@bonsamti.onrender.com") && validateEmailAddress(email)
}
