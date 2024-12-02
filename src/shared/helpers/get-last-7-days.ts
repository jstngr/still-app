/**
 * Returns the names of the last 7 days in abbreviated weekday number.
 *
 * @returns {number[]} An array of abbreviated weekday numbers for the last 7 days, starting from 6 days ago to today.
 *
 * @example
 * // If today is Wednesday:
 * const days = getLast7Days();
 * console.log(days); // [4, 5, 6, 0, 1, 2, 3]
 */
export default function getLast7Days(): number[] {
  const result: number[] = [];

  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    result.push(date.getDay());
  }

  return result;
}
