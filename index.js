#!/usr/bin/env node

'use strict'

const Inquirer = require('inquirer')
const Chalk = require('chalk')
const RandomColor = require('randomcolor')
const SpawnSync = require('child_process').spawnSync
const git = require('simple-git/promise')(process.cwd())

async function init() {
  const result = await git.branch()

  const branches = result.all

  const branchPrompt = await Inquirer.prompt([
    {
      type: 'checkbox',
      name: 'choice',
      message: "What's your branches to compare?",
      choices: branches,
      validate: input => {
        if (input.length < 2) {
          return 'You have to select two branches!'
        }
        return true
      }
    }
  ])

  const choices = branchPrompt.choice

  const cmdPrompt = await Inquirer.prompt([
    {
      type: 'input',
      name: 'cmd',
      message: 'Please enter the command you want to execute in both branches!'
    }
  ])

  const cmd = cmdPrompt.cmd

  choices.forEach(async branch => {
    console.log(Chalk.hex(RandomColor())(`Checking out "${branch}"`))
    await git.checkout(branch)

    console.log(Chalk.grey(`Execute "${cmd}"`))
    SpawnSync(cmd, {
      stdio: 'inherit',
      shell: true,
      encoding: 'utf-8'
    })
  })
}

init()
