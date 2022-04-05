import * as core from '@actions/core'
import * as github from '@actions/github'
import {EventType, Option} from './args'
import type {IssueCommentEvent, IssuesEvent} from '@octokit/webhooks-types'
import {containsLanguages, translate2English} from './translate'
import {Octokit} from '@octokit/rest'
import {commentTemplate, cleanAnnotation} from './markdown'

export async function translateIssue(t: EventType, opt: Option): Promise<void> {
  core.info(`translateIssue event type: ${t}`)
  const {owner, repo} = github.context.repo

  if (t === EventType.IssueOpened) {
    if (opt.ModifyBodySwitch) {
      // translate issue body
      const issueCommentPayload = github.context.payload as IssueCommentEvent
      const issueNumber = issueCommentPayload.issue.number
      const originComment = issueCommentPayload.issue.body

      await translateComment(
        owner,
        repo,
        opt.GithubToken,
        opt.CommentNote,
        opt.MatchLanguages,
        opt.MinMatchPercent,
        issueNumber,
        originComment
      )
    }

    if (opt.ModifyTitleSwitch) {
      // translate issue title
      const issuePayload = github.context.payload as IssuesEvent
      const issueNumber = issuePayload.issue.number
      const originTitle = issuePayload.issue.title
      await translateTitle(
        owner,
        repo,
        opt.GithubToken,
        opt.MatchLanguages,
        opt.MinMatchPercent,
        issueNumber,
        originTitle
      )
    }
  } else if (opt.ModifyCommentSwitch) {
    // translate issue comment body
    const issueCommentPayload = github.context.payload as IssueCommentEvent
    const issueNumber = issueCommentPayload.issue.number
    const originComment = issueCommentPayload.comment.body

    await translateComment(
      owner,
      repo,
      opt.GithubToken,
      opt.CommentNote,
      opt.MatchLanguages,
      opt.MinMatchPercent,
      issueNumber,
      originComment
    )
  }
}

async function translateComment(
  owner: string,
  repo: string,
  token: string,
  note: string,
  matchLanguages: string[],
  minMatchPercent: number,
  issueNumber: number,
  originComment: string | null
): Promise<void> {
  if (originComment == null) return

  // clean markdown annotation
  originComment = cleanAnnotation(originComment)
  // languages less than than minMatchPercent
  if (!containsLanguages(originComment, matchLanguages, minMatchPercent)) {
    return
  }

  const targetComment = await translate2English(originComment)
  core.info(
    `translate issues comment: ${targetComment} origin: ${originComment}`
  )

  // avoid infinite loops
  if (targetComment === originComment) {
    core.warning(`translate origin target is the same`)
    return
  }

  const octokit = new Octokit({
    auth: token
  })

  const res = await octokit.issues.createComment({
    owner,
    repo,
    issue_number: issueNumber,
    body: commentTemplate(note, targetComment)
  })

  core.info(`create issue comment status:${res.status}`)
}

async function translateTitle(
  owner: string,
  repo: string,
  token: string,
  matchLanguages: string[],
  minMatchPercent: number,
  issueNumber: number,
  originTitle: string
): Promise<void> {
  // dose not have languages
  if (!containsLanguages(originTitle, matchLanguages, minMatchPercent)) {
    return
  }

  const targetTitle = await translate2English(originTitle)
  core.info(`translate issues title: ${targetTitle} origin: ${originTitle}`)
  // avoid infinite loops
  if (targetTitle === originTitle) {
    core.warning(`translate origin target is the same`)
    return
  }

  const octokit = new Octokit({
    auth: token
  })

  const res = await octokit.issues.update({
    owner,
    repo,
    issue_number: issueNumber,
    title: targetTitle
  })

  core.info(`change issue title status:${res.status}`)
}
