import {containsLanguages} from '../src/translate'
import {expect, test} from '@jest/globals'
import {getLanguageExpression} from '../src/language/index'

test('contains language', async () => {
  const input = parseInt('foo', 10)

  const cn = '我需要翻译成英文'
  const en = 'I need it translated into English'
  const rus = 'мне трэба перакласці на англійскую'

  expect(containsLanguages(cn, ['cmn'], 0)).toEqual(true)
  expect(containsLanguages(cn, ['jpn'], 0)).toEqual(true)
  expect(containsLanguages(rus, ['rus'], 0)).toEqual(true)

  expect(containsLanguages(rus, ['cmn'], 0)).toEqual(false)
  expect(containsLanguages(cn, ['rus'], 0)).toEqual(false)
  expect(containsLanguages(cn, ['ben'], 0)).toEqual(false)
  expect(containsLanguages(cn, ['eng'], 0)).toEqual(false)
  expect(containsLanguages(en, ['cmn'], 0)).toEqual(false)
  expect(containsLanguages(en, ['jpn'], 0)).toEqual(false)
})

test('get language exprs', async () => {
  //support
  expect(getLanguageExpression('cmn')).not.toEqual(null)
  expect(getLanguageExpression('spa')).not.toEqual(null)
  expect(getLanguageExpression('rus')).not.toEqual(null)
  expect(getLanguageExpression('ben')).not.toEqual(null)
  // not support
  expect(getLanguageExpression('test')).toEqual(null)
  expect(getLanguageExpression('havent')).toEqual(null)
})
