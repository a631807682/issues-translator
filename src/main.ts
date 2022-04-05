import * as core from '@actions/core'
import * as github from '@actions/github'
import {EventType, getActionType, getOption} from './parse'
import {targetLanguage} from './language'
import {translateIssue} from './issues'

async function run(): Promise<void> {
  try {
    const t = getActionType()
    if (t === EventType.NotAllow) {
      core.setFailed(
        `The status of the action not allow, receive - ${github.context.payload.action} on ${github.context.eventName}`
      )
    }

    const opt = getOption()
    if (opt.MatchLanguages.includes(targetLanguage)) {
      core.setFailed(
        `Not support ${targetLanguage} language which should be translate to`
      )
    }
    return await translateIssue(t, opt)
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
