# issues-translator

[![build-test](https://github.com/a631807682/issues-translator/workflows/build-test/badge.svg?branch=main 'test status')](https://github.com/a631807682/issues-translator/actions)

> translate issues to English

## Desc

Different from this project [issues-translate-action](https://github.com/usthe/issues-translate-action)
The project does not try to guess user's language, because `Issues` usually contain multiple languages, and the project determines whether translation is required by `match-languages` which user config.

## Usage

```yaml
name: 'issues-translator'
on:
  issue_comment:
    types: [created]
  issues:
    types: [opened]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: a631807682/issues-translator@v1.1.0
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
          match-languages: cmn,rus
          modify-title: true
          modify-body: true
          modify-comment: true
          comment-note: Bot detected the issue body's language is not English, translate it automatically.
```

1. `match-languages` Match languages which will be translate. [Support language](Language.md)
2. `modify-title` Should modify issues title.
3. `modify-body` Should create comment to translate issues body.
4. `modify-comment` Should create comment to translate issues comment.
5. `comment-note` Bot reply template content
