#!/usr/bin/env node

'use strict'

const Inquirer = require('inquirer')
const Chalk = require('chalk')
const RandomColor = require('randomcolor')
const Program = require('commander')
const Fs = require('fs')
const git = require('simple-git/promise')(process.cwd())
const spawn = require('child_process').spawn

Inquirer.registerPrompt('command', require('inquirer-command-prompt'))

Program.description(
  'branch-comparer - checkout multiple repositorys and execute scripts'
)
  .option(
    '-f --file',
    'Save the results as files in the current working directory',
    true
  )
  .option(
    '-r --rounds <n>',
    'How many times should the command be executed?',
    parseInt
  )
  .option('-c --cli', 'Print the results in the console', true)
  .parse(process.argv)

git
  .branch()
  .then(result => {
    const originBranch = getCurrentBranch(result.branches)
    const branches = result.all

    function getCurrentBranch(branches) {
      for (let branch in branches) {
        if (branches[branch].current) {
          return branches[branch]
        }
      }
    }

    console.log(Chalk.green(`Current Branch is ${originBranch.name} ${originBranch.commit}`))

    return Inquirer.prompt([
      {
        type: 'checkbox',
        name: 'choice',
        message: "What's your branches to compare?",
        choices: branches,
        validate: input => {
          if (input.length < 2) {
            return 'You have to select at least two branches!'
          }
          return true
        }
      }
    ])
      .then(result => {
        const choices = result.choice

        return Inquirer.prompt([
          {
            type: 'command',
            name: 'cmd',
            autoCompletion: ['npm run benchmark', 'node', 'npm run', 'npm run test'],
            message:
              'Please enter the command you want to execute in all branches!'
          }
        ]).then(result => {
          const cmd = result.cmd
          return run(choices, cmd, Program.file, Program.rounds || 1)
        })
      })
      .catch(() => {
        return git.checkout(originBranch.commit)
      })
      .then(() => {
        return git.checkout(originBranch.commit)
      })
      .then(() => console.log(Chalk.green(`Back to ${originBranch.name} ${originBranch.commit}`)))
  })
  .catch(console.error)

function run(branches, cmd, mode, rounds) {
  return branches.reduce(function(p, branch) {
    return p.then(function() {
      console.log(Chalk.hex(RandomColor())(`Checking out "${branch}"`))
      return git.checkout(branch).then(() => {
        return execute(branch, cmd, mode, rounds)
      })
    })
  }, Promise.resolve()) // initial
}

function execute(branch, cmd, mode, rounds) {
  let iterations = []
  for (let i = 0; i < rounds; i++) {
    iterations.push(branch)
  }

  return iterations.reduce(function(p, branch, round) {
    return p.then(function() {
      console.log(Chalk.grey(`Execute "${cmd}"`))
      return spawnAsync(branch, cmd, mode, round)
    })
  }, Promise.resolve()) // initial
}

function spawnAsync(branch, cmd, mode, round) {
  return new Promise((resolve, reject) => {
    const command = spawn(cmd, {
      stdio: mode ? 'pipe' : 'inherit',
      shell: true,
      encoding: 'utf-8'
    })

    if (Program.file) {
      command.stdout.pipe(
        Fs.createWriteStream(`branch.${branch}.round-${round + 1}.log`)
      )
    }

    command.on('close', code => {
      console.log(
        Chalk.grey(`Executed: "${cmd}" and exited with code: ${code}`)
      )
      resolve()
    })
  })
}
