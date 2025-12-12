/**
 * Checks if a given expiry date (in MM/YY format) is expired compared to the current date.
 *
 * @param {string} date - Expiry date in the format "MM/YY" (e.g., "08/25").
 * @returns {boolean} - Returns true if the date is expired, false if still valid.
 *
 * Logic:
 * 1. Get today's month and year.
 * 2. Parse expiry month and year from the given date string.
 * 3. If expiry year is less than equal to current year → expired.
 * 4. If expiry year is the same but expiry month is <= current month → expired.
 * 5. Otherwise → not expired.
 */
const isDateCurrent = (date) => {
  const today = new Date();

  const todayMonth = today.getMonth() + 1;
  const todayYear = today.getFullYear() % 100;

  const [expiryMonth, expiryYear] = date.split("/").map(Number);

  if (expiryYear <= todayYear) {
    return true;
  }

  if (expiryYear === todayYear && expiryMonth <= todayMonth) return true;
  return false;
};

module.exports = isDateCurrent;
