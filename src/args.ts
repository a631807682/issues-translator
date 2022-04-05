/* eslint-disable no-shadow */
import * as core from '@actions/core'
import * as github from '@actions/github'
import {defaultLanguage} from './language'

function isTrue(val: string): boolean {
  return val === 'true'
}

function vailGitActionEvent(event: string, action: string): boolean {
  return (
    github.context.eventName === event &&
    github.context.payload.action === action
  )
}

export type Option = {
  ModifyTitleSwitch: boolean
  ModifyCommentSwitch: boolean
  ModifyBodySwitch: boolean
  CommentNote: string
  GithubToken: string
  MatchLanguages: string[]
  MinMatchPercent: number
}

export function getOption(): Option {
  const opt: Option = {
    ModifyTitleSwitch: isTrue(core.getInput('modify-title')),
    ModifyBodySwitch: isTrue(core.getInput('modify-body')),
    ModifyCommentSwitch: isTrue(core.getInput('modify-comment')),
    CommentNote: core.getInput('comment-note'),
    GithubToken: core.getInput('github-token', {required: true}),
    MatchLanguages: [],
    MinMatchPercent: 0.05
  }

  const matchLanguages = core.getInput('match-languages')
  if (matchLanguages === '') {
    opt.MatchLanguages = [defaultLanguage]
  } else {
    const lgs = matchLanguages.split(',')
    opt.MatchLanguages = lgs.map(d => d.trim())
  }

  const minMatchPercent = parseFloat(core.getInput('min-match-percent'))
  if (!isNaN(minMatchPercent)) {
    if (minMatchPercent >= 0 && minMatchPercent < 1) {
      opt.MinMatchPercent = minMatchPercent
    }
  }

  return opt
}

export enum EventType {
  NotAllow = 0,
  CommentCreated,
  IssueOpened
}

export function getActionType(): EventType {
  let t = EventType.NotAllow
  if (vailGitActionEvent('issue_comment', 'created')) {
    t = EventType.CommentCreated
  } else if (vailGitActionEvent('issues', 'opened')) {
    t = EventType.IssueOpened
  }
  return t
}
