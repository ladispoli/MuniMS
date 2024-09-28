/**
 * Capitalize the first letter of a string
 */
function capitalize(str: string): string {
  return str.toLowerCase().replace(/^\w/, (c) => c.toUpperCase());
}

/**
 * Capitalize the first letter of each word in a string
 */
function startCase(str: string): string {
  return str.trim().replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
}

/**
 * convert string to slug
 */
function slugify(str: string): string {
  return str
    .toString() // Cast to string (optional)
    .normalize('NFKD') // The normalize() using NFKD method returns the Unicode Normalization Form of a given string.
    .toLowerCase() // Convert the string to lowercase letters
    .trim() // Remove whitespace from both sides of a string (optional)
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/'+/g, '-') // replace ' with -
    .replace(/[^\w-]+/g, '') // Remove all non-word chars
    .replace(/--+/g, '-'); // Replace multiple - with single -
}

/**
 * convert slug to string
 */
function unslugify(slug: string): string {
  return slug.replace(/[-_]/g, ' ').toLowerCase();
}

/**
 * truncate text and add ellipsis
 */
function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) {
    return str;
  } else {
    let truncatedText = str.substring(0, maxLength - 3) + '...';
    // Check if the last character of the truncated text is part of a word
    if (!/\s/.test(str[maxLength - 4]) && /\s/.test(str[maxLength - 3])) {
      // Find the last space character within the truncated text
      const lastSpaceIndex = truncatedText.lastIndexOf(' ');
      // Trim the text to the last complete word
      truncatedText = truncatedText.substring(0, lastSpaceIndex) + '...';
    }
    return truncatedText;
  }
}

/**
 * Function to convert Roman numerals to Arabic numerals
 */
function romanToArabic(roman: string): number {
  const romanNumerals: { [key: string]: number } = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
  let arabic = 0;
  let i = roman.length;
  while (i--) {
    if (romanNumerals[roman[i]] < romanNumerals[roman[i + 1]]) arabic -= romanNumerals[roman[i]];
    else arabic += romanNumerals[roman[i]];
  }
  return arabic;
}

export { capitalize, startCase, slugify, unslugify, truncate, romanToArabic };
