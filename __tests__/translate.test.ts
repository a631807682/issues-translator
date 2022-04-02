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

test('hybrid contains language', async () => {
  const hybrid = `
**Describe the bug**
不翻译注释和代码

<!--
To ensure your issue be handled, the issue *MUST* include a GORM Playground Pull Request Link that can reproduce the bug, which is important to help others understand your issue effectively and make sure the issue hasn't been fixed, refer: https://github.com/go-gorm/playground

Without the link, your issue most likely will be IGNORED

CHANGE FOLLOWING URL TO YOUR PLAYGROUND LINK
-->

\`\`\`go
//连接数据库gorm.io/gorm
db, err := gorm.Open(mysql.New(mysql.Config{
	DriverName: "mysql",
	DSN:        "root:123456@(127.0.0.1:3306)/gomicro_test?charset=utf8mb4&parseTime=True&loc=Local",
}))
\`\`\`

  `

  const hybrid2 =
    '**Describe the bug**\n不翻译注释和代码\n```go\n//连接数据库gorm.io/gorm\ndb, err := gorm.Open(mysql.New(mysql.Config{\n	DriverName: "mysql",\n	DSN:        "root:123456@(127.0.0.1:3306)/gomicro_test?charset=utf8mb4&parseTime=True&loc=Local",\n}))\n```\n'

  expect(containsLanguages(hybrid, ['cmn'], 0.1)).toEqual(true)
  expect(containsLanguages(hybrid2, ['cmn'], 0.1)).toEqual(true)
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
