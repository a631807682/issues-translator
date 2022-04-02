import * as core from '@actions/core'
import {cleanAnnotation, cleanCode} from './markdown'
import {getLanguageExpression} from './language'
import translate from '@tomsun28/google-translate-api'

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
export function containsLanguages(
  value: string | null,
  matchLanguages: string[],
  percent: number
): boolean {
  if (value === null) {
    return false
  }

  value = cleanAnnotation(value)
  value = cleanCode(value)

  for (const name of matchLanguages) {
    const expr = getLanguageExpression(name)
    if (expr !== null) {
      const count = getOccurrence(value, expr)
      if (count > percent) {
        return true
      }

      if (count > 0) {
        core.info(`clean value is\n${value}`)
        core.info(
          `contains languages ${name} contains percent:${count} less than percent:${percent}`
        )
      }
    } else {
      core.setFailed(`contains languages not support ${name}`)
    }
  }

  return false
}

export async function translate2English(body: string | null): Promise<string> {
  if (body === null) {
    return ''
  }

  const res = await translate(body, {to: 'en'})
  return res.text
}
