import translate from '@tomsun28/google-translate-api'

const cmn =
  /[\u2E80-\u2E99\u2E9B-\u2EF3\u2F00-\u2FD5\u3005\u3007\u3021-\u3029\u3038-\u303B\u3400-\u4DBF\u4E00-\u9FFF\uF900-\uFA6D\uFA70-\uFAD9]|\uD81B[\uDFE2\uDFE3\uDFF0\uDFF1]|[\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872\uD874-\uD879\uD880-\uD883][\uDC00-\uDFFF]|\uD869[\uDC00-\uDEDF\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF38\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1\uDEB0-\uDFFF]|\uD87A[\uDC00-\uDFE0]|\uD87E[\uDC00-\uDE1D]|\uD884[\uDC00-\uDF4A]/g

function cleanMarkdown(s: string): string {
  // remove markdown comment
  return s.replace(/<!--[\s\S]*?-->/g, '')
}

function getOccurrence(value: string, expression: RegExp): number {
  const count = value.match(expression)

  return (count ? count.length : 0) / value.length || 0
}

/**
 * Contains Chinese.
 *
 * @param {string} value
 *   Value to check.
 * @param {number} percent
 *   Ff larger then percent 0 ~ 1
 * @return {boolean}
 *   contains chinese.
 */
export function containsChinese(
  value: string | null,
  percent: number
): boolean {
  if (value === null) {
    return false
  }

  const count = getOccurrence(cleanMarkdown(value), cmn)
  return count > percent
}

export async function translate2English(body: string | null): Promise<string> {
  if (body === null) {
    return ''
  }

  const res = await translate(body, {to: 'en'})
  return res.text
}
