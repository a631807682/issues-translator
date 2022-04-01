# issues-translator

> trnaslate issues to English

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
      - uses: a631807682/issues-translator@v1.0.0
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
          match-languages: cmn,rus
          modify-title: true
          modify-comment: true
          comment-note: Bot detected the issue body's language is not English, translate it automatically.
```
