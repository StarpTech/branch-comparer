#!/usr/bin/env node

'use strict'

const Inquirer = require('inquirer')
const Chalk = require('chalk')
const RandomColor = require('randomcolor')
const spawn = require('child_process').spawn
const Program = require('commander')
const { promisify } = require('util')
const Fs = require('fs')
const writeFileAsync = promisify(Fs.writeFile)
const git = require('simple-git/promise')(process.cwd())

Program.description(
  'branch-comparer - checkout multiple repositorys and execute scripts'
)
  .option(
    '-f --file',
    'Save the results as files in the current working directory',
    true
  )
  .option('-c --cli', 'Print the results in the console', true)
  .parse(process.argv)

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
    return spawnPromise(branch, cmd)
  })
}

function spawnPromise(branch, cmd) {
  return new Promise((resolve, reject) => {
    const command = spawn(cmd, {
      stdio: Program.file ? 'pipe' : 'inherit',
      shell: true,
      encoding: 'utf-8'
    })

    if (Program.file) {
      command.stdout.pipe(Fs.createWriteStream(`branch.${branch}.log`))
    }

    command.on('close', code => {
      console.log(
        Chalk.grey(`Executed: "${cmd}" and exited with code: ${code}`)
      )
      resolve()
    })
  })
}
