/* eslint-disable no-shadow */
import * as core from '@actions/core'
import * as github from '@actions/github'

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
  CommentNote: string
  GithubToken: string
}

export function getOption(): Option {
  const opt: Option = {
    ModifyTitleSwitch: isTrue(core.getInput('modify-title')),
    ModifyCommentSwitch: isTrue(core.getInput('modify-comment')),
    CommentNote: core.getInput('comment-note'),
    GithubToken: core.getInput('github-token', {required: true})
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
