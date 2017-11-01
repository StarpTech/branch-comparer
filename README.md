[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](#badge)
[![NPM version](https://img.shields.io/npm/v/branch-comparer.svg?style=flat)](https://www.npmjs.com/package/branch-comparer)
# branch-comparer
Checkout multiple git repositorys, execute scripts and return to the origin branch.
Perfect to run benchmarks in different branches for copy & paste the result in a PR.

## Installation
```
npm i -g branch-comparer
```
## Usage

```sh
branchcmp
```
Print results in files
```sh
branchcmp --file
```
_Will create files in form of `branch.<branch>.log` in the current working directory._

## Features

- Select multiple branches from a list
- Execute any command synchronously
- Return to origin branch after finish
- Write results in files or console

## Example

![example](https://github.com/StarpTech/branch-comparer/blob/master/branchcmp.gif "Example branchcmp")
