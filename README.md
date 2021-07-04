[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](#badge)
[![NPM version](https://img.shields.io/npm/v/branch-comparer.svg?style=flat)](https://www.npmjs.com/package/branch-comparer)
# branch-comparer
Checkout multiple git branches, execute scripts and return to the origin branch.
Ideally to run benchmarks in different branches and copy & paste the results in a PR.

## Features

- Select multiple branches from a list
- Run scripts multiple times in a row
- Execute any command synchronously
- Return to origin branch after finish
- Write results in files or console
- Gitflow mode which compares current branch with master (configurable)

## Installation
```
npm i -g branch-comparer
```
## Usage
Print the results in the console
```sh
branchcmp
```
Print results in files
```sh
branchcmp --file --script "node -v"
```
_Will create files in form of `branch.<branch>.log` in the current working directory._

Run scripts two rounds and save the results in files
```sh
branchcmp --file --rounds 2 --script "node -v"
```
_Will create files in form of `branch.<branch>.round-<round>.log` in the current working directory._

## Help

```
branchcmp -h
```

## Example

![example](https://github.com/StarpTech/branch-comparer/blob/master/branchcmp.gif "Example branchcmp")
