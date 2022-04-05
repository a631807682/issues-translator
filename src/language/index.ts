import {data} from './data'
import {expressions} from './expression'
import {lanGoogleMap} from './g'

export function getLanguageExpression(name: string): RegExp | null {
  if (expressions[name]) {
    return expressions[name]
  }

  for (const scriptName in data) {
    const subLanguage = data[scriptName]
    if (subLanguage !== undefined) {
      if (subLanguage[name] !== undefined && expressions[scriptName]) {
        return expressions[scriptName]
      }
    }
  }
  return null
}

// default is chinese
export const defaultLanguage = 'cmn'
// cannot include english
export const targetLanguage = 'eng'

export function getGoogleFrom(lanName: string): string | undefined {
  return lanGoogleMap[lanName]
}
