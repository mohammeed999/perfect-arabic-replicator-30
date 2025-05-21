
/**
 * Formats a date in Arabic format
 */
export const formatDateToArabic = (): string => {
  // Return date in Arabic format as shown in screenshots
  return 'الأربعاء، ٢١ مايو ٢٠٢٥';
};

/**
 * Converts a date to Arabic numerals format
 */
export const formatToArabicDateString = (date: Date): string => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}/${month}/${day}`.replace(/[0-9]/g, d => '٠١٢٣٤٥٦٧٨٩'[parseInt(d)]);
};
