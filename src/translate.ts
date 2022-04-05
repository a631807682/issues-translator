import * as core from '@actions/core'
import {getLanguageExpression, targetLanguage, getGoogleFrom} from './language'
import translate from '@tomsun28/google-translate-api'

function getOccurrenceCount(value: string, expression: RegExp): number {
  const count = value.match(expression)
  return count ? count.length : 0
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
export function containsLanguageName(
  value: string | null,
  matchLanguages: string[],
  percent: number
): string | null {
  if (value === null) {
    return null
  }
  // english match count
  const enExpr = getLanguageExpression(targetLanguage)
  const enCount = getOccurrenceCount(value, enExpr!)

  // language match count
  for (const name of matchLanguages) {
    const expr = getLanguageExpression(name)
    if (expr !== null) {
      const count = getOccurrenceCount(value, expr)
      const lanPercent =
        enCount == 0 && count == 0 ? 0 : count / (enCount + count)

      if (lanPercent > percent) {
        return name
      }

      if (lanPercent > 0) {
        core.info(`clean value is\n${value}`)
        core.info(
          `contains languages ${name} contains percent:${lanPercent} less than percent:${percent}
           languages ${name} count:${count} english count:${enCount}`
        )
      }
    } else {
      core.setFailed(`contains languages not support ${name}`)
    }
  }

  return null
}

export async function translate2English(
  body: string | null,
  lanName: string
): Promise<string> {
  if (body === null) {
    return ''
  }

  const from = getGoogleFrom(lanName)
  const res = await translate(body, {from, to: 'en'})
  return res.text
}
