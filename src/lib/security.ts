/**
 * Security utilities for handling external links and user input
 * Implements security measures for Requirements 2.3 and 2.4
 */

/**
 * Validates if a URL is safe to display and link to
 * @param url - The URL to validate
 * @returns boolean indicating if the URL is valid and safe
 */
export function isValidUrl(url: string): boolean {
  if (!url || typeof url !== 'string') {
    return false;
  }

  // Remove whitespace
  const trimmedUrl = url.trim();
  
  if (!trimmedUrl) {
    return false;
  }

  try {
    const urlObj = new URL(trimmedUrl);
    
    // Only allow http and https protocols
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      return false;
    }

    // Block localhost and private IP ranges for security
    const hostname = urlObj.hostname.toLowerCase();
    
    // Block localhost variations
    if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1') {
      return false;
    }

    // Block private IP ranges (basic check)
    if (hostname.startsWith('192.168.') || 
        hostname.startsWith('10.') || 
        hostname.match(/^172\.(1[6-9]|2[0-9]|3[0-1])\./)) {
      return false;
    }

    // Block suspicious domains
    const suspiciousDomains = [
      'bit.ly',
      'tinyurl.com',
      'goo.gl',
      't.co'
    ];
    
    if (suspiciousDomains.some(domain => hostname.includes(domain))) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}

/**
 * Sanitizes a URL by ensuring it's properly formatted and safe
 * @param url - The URL to sanitize
 * @returns Sanitized URL or null if invalid
 */
export function sanitizeUrl(url: string): string | null {
  if (!isValidUrl(url)) {
    return null;
  }

  try {
    const urlObj = new URL(url.trim());
    
    // Ensure https for better security when possible
    if (urlObj.protocol === 'http:' && !urlObj.hostname.includes('localhost')) {
      // Don't force HTTPS conversion as it might break some sites
      // Just return the original URL if it's valid
    }
    
    return urlObj.toString();
  } catch {
    return null;
  }
}

/**
 * Sanitizes text content to prevent XSS attacks
 * @param text - The text to sanitize
 * @returns Sanitized text
 */
export function sanitizeText(text: string): string {
  if (!text || typeof text !== 'string') {
    return '';
  }

  return text
    .trim()
    // Remove potential HTML tags
    .replace(/<[^>]*>/g, '')
    // Remove potential script content
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    // Limit length to prevent abuse
    .substring(0, 500);
}

/**
 * Extracts and validates domain from URL
 * @param url - The URL to extract domain from
 * @returns Domain string or null if invalid
 */
export function extractDomain(url: string): string | null {
  const sanitizedUrl = sanitizeUrl(url);
  if (!sanitizedUrl) {
    return null;
  }

  try {
    const urlObj = new URL(sanitizedUrl);
    return urlObj.hostname.replace('www.', '');
  } catch {
    return null;
  }
}

/**
 * Gets security attributes for external links
 * @returns Object with security attributes for external links
 */
export function getExternalLinkAttributes() {
  return {
    target: '_blank',
    rel: 'noopener noreferrer nofollow',
    // Add referrer policy for additional privacy
    referrerPolicy: 'no-referrer' as const
  };
}

/**
 * Validates and sanitizes source link data
 * @param source - Source link object to validate
 * @returns Validated source link or null if invalid
 */
export function validateSourceLink(source: any): {
  title: string;
  url: string;
  domain: string;
  publishedDate?: string;
} | null {
  if (!source || typeof source !== 'object') {
    return null;
  }

  const sanitizedUrl = sanitizeUrl(source.url);
  if (!sanitizedUrl) {
    return null;
  }

  const domain = extractDomain(sanitizedUrl);
  if (!domain) {
    return null;
  }

  const sanitizedTitle = sanitizeText(source.title);
  if (!sanitizedTitle) {
    return null;
  }

  const result: any = {
    title: sanitizedTitle,
    url: sanitizedUrl,
    domain: domain
  };

  // Validate published date if provided
  if (source.publishedDate) {
    const date = new Date(source.publishedDate);
    if (!isNaN(date.getTime())) {
      result.publishedDate = source.publishedDate;
    }
  }

  return result;
}

/**
 * Batch validates and sanitizes multiple source links
 * @param sources - Array of source links to validate
 * @returns Array of validated source links
 */
export function validateSourceLinks(sources: any[]): Array<{
  title: string;
  url: string;
  domain: string;
  publishedDate?: string;
}> {
  if (!Array.isArray(sources)) {
    return [];
  }

  return sources
    .map(validateSourceLink)
    .filter((source): source is NonNullable<typeof source> => source !== null)
    .slice(0, 10); // Limit to 10 sources to prevent UI overflow
}