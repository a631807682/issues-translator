import {expect, test} from '@jest/globals'
import {cleanAnnotation, cleanCode} from '../src/markdown'

test('clean annotation', async () => {
  const beforeData = `
    <!--- 
        some annotation here
    --->
    other data
    <!--- 
        other annotation here
    --->
    `
  const afterData = 'other data'

  expect(cleanAnnotation(beforeData).trim()).toEqual(afterData)
})

test('clean annotation', async () => {
  const beforeData = `
\`\`\`js
const foo = () => {}
\`\`\`

other data

\`\`\`
const foo = () => {}
\`\`\`

\`\`\`go
defer foo()
\`\`\`
    `
  const afterData = 'other data'

  expect(cleanCode(beforeData).trim()).toEqual(afterData)
})
