import * as github from '@actions/github'
import {EventType, Option} from './parse'
import type {IssueCommentEvent, IssuesEvent} from '@octokit/webhooks-types'
import {containsChinese, translate2English} from './translate'
import {Octokit} from '@octokit/rest'

export async function translateIssue(t: EventType, opt: Option): Promise<void> {
  if (t === EventType.IssueOpened) {
    if (opt.ModifyCommentSwitch) {
      await translateComment(opt.GithubToken)
    }

    if (opt.ModifyTitleSwitch) {
      await translateTitle(opt.GithubToken)
    }
  } else if (opt.ModifyCommentSwitch) {
    await translateComment(opt.GithubToken)
  }
}

async function translateComment(token: string): Promise<void> {
  const {owner, repo} = github.context.repo
  const issueCommentPayload = github.context.payload as IssueCommentEvent
  const issueNumber = issueCommentPayload.issue.number
  const originComment = issueCommentPayload.issue.body

  // chinese less than than 20%
  if (!containsChinese(originComment, 0.2)) {
    return
  }

  const targetComment = await translate2English(originComment)

  const octokit = new Octokit({
    auth: token
  })

  await octokit.issues.createComment({
    owner,
    repo,
    issue_number: issueNumber,
    body: targetComment
  })
}

async function translateTitle(token: string): Promise<void> {
  const {owner, repo} = github.context.repo
  const issuePayload = github.context.payload as IssuesEvent
  const issueNumber = issuePayload.issue.number
  const originTitle = issuePayload.issue.title

  // has chiness
  if (!containsChinese(originTitle, 0)) {
    return
  }

  const targetTitle = await translate2English(originTitle)

  const octokit = new Octokit({
    auth: token
  })

  await octokit.issues.update({
    owner,
    repo,
    issue_number: issueNumber,
    targetTitle
  })
}
