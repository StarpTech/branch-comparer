#!/usr/bin/env node

'use strict'

const Inquirer = require('inquirer')
const Chalk = require('chalk')
const RandomColor = require('randomcolor')
const SpawnSync = require('child_process').spawnSync
const git = require('simple-git/promise')(process.cwd())

git
  .branch()
  .then(result => {
    const branches = result.all

    return Inquirer.prompt([
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
    ]).then(result => {
      const choices = result.choice

      return Inquirer.prompt([
        {
          type: 'input',
          name: 'cmd',
          message:
            'Please enter the command you want to execute in both branches!'
        }
      ]).then(result => {
        const cmd = result.cmd

        choices.forEach(async branch => {
          console.log(Chalk.hex(RandomColor())(`Checking out "${branch}"`))
          await git
            .checkout(branch)
            .then(() => {
              console.log(Chalk.grey(`Execute "${cmd}"`))
              SpawnSync(cmd, {
                stdio: 'inherit',
                shell: true,
                encoding: 'utf-8'
              })
            })
            .catch(console.error)
        })
      })
    })
  })
  .catch(console.error)
