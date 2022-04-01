import * as core from '@actions/core'
import * as github from '@actions/github'
import {EventType, Option} from './parse'
import type {IssueCommentEvent, IssuesEvent} from '@octokit/webhooks-types'
import {containsChinese, translate2English} from './translate'
import {Octokit} from '@octokit/rest'

export async function translateIssue(t: EventType, opt: Option): Promise<void> {
  if (t === EventType.IssueOpened) {
    if (opt.ModifyCommentSwitch) {
      await translateComment(opt.GithubToken, opt.CommentNote)
    }

    if (opt.ModifyTitleSwitch) {
      await translateTitle(opt.GithubToken)
    }
  } else if (opt.ModifyCommentSwitch) {
    await translateComment(opt.GithubToken, opt.CommentNote)
  }
}

async function translateComment(token: string, note: string): Promise<void> {
  const {owner, repo} = github.context.repo
  const issueCommentPayload = github.context.payload as IssueCommentEvent
  const issueNumber = issueCommentPayload.issue.number
  const originComment = issueCommentPayload.issue.body

  // chinese less than than 20%
  if (!containsChinese(originComment, 0.2)) {
    return
  }

  const targetComment = await translate2English(originComment)
  core.info(
    `translate issues comment: ${targetComment} origin: ${originComment}`
  )

  const octokit = new Octokit({
    auth: token
  })

  const res = await octokit.issues.createComment({
    owner,
    repo,
    issue_number: issueNumber,
    body: `
    > ${note}
    
    ${targetComment}
    `
  })

  core.info(`create issue comment status:${res.status}`)
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
  core.info(`translate issues title: ${targetTitle} origin: ${originTitle}`)

  const octokit = new Octokit({
    auth: token
  })

  const res = await octokit.issues.update({
    owner,
    repo,
    issue_number: issueNumber,
    targetTitle
  })

  core.info(`change issue title status:${res.status}`)
}
