#!/usr/bin/env node

'use strict'

const Inquirer = require('inquirer')
const Chalk = require('chalk')
const RandomColor = require('randomcolor')
const spawn = require('child_process').spawn
const git = require('simple-git/promise')(process.cwd())

git
  .branch()
  .then(result => {
    const originBranch = result.current
    const branches = result.all

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
            type: 'input',
            name: 'cmd',
            message:
              'Please enter the command you want to execute in all branches!'
          }
        ]).then(result => {
          const cmd = result.cmd
          return run(choices, cmd)
        })
      })
      .then(() => git.checkout(originBranch))
  })
  .catch(console.error)

function run(branches, cmd) {
  return branches.reduce(function(p, branch) {
    return p.then(function() {
      return checkoutAndExecute(branch, cmd)
    })
  }, Promise.resolve()) // initial
}

function checkoutAndExecute(branch, cmd) {
  console.log(Chalk.hex(RandomColor())(`Checking out "${branch}"`))
  return git.checkout(branch).then(() => {
    console.log(Chalk.grey(`Execute "${cmd}"`))
    return spawnPromise(cmd)
  })
}

function spawnPromise(cmd) {
  return new Promise((resolve, reject) => {
    const command = spawn(cmd, {
      stdio: 'inherit',
      shell: true,
      encoding: 'utf-8'
    })

    command.on('close', code => {
      console.log(
        Chalk.grey(`Executed: "${cmd}" and exited with code: ${code}`)
      )
      resolve()
    })
  })
}
