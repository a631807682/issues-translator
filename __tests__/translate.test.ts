import {containsChinese} from '../src/translate'
import {expect, test} from '@jest/globals'

test('contains language', async () => {
  const input = parseInt('foo', 10)

  const cn = '我需要翻译成英文'
  const en = 'I need it translated into English'
  expect(containsChinese(cn, 0)).toEqual(true)
  expect(containsChinese(en, 0)).toEqual(false)
})
