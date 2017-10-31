# branch-comparer
Checkout multiple git repositorys, execute scripts and return to the origin branch.
Perfect to run benchmarks in different branches for copy & paste the result in a PR.

## Installation
```
npm i -g branch-comparer
branchcmp
```
## Usage

```
? What's your branches to compare? master, feature_X
? Please enter the command you want to execute in both branches! npm run test
Checking out "master"
Execute "npm run benchmark"
...
Checking out "test"
Execute "npm run benchmark"
...
```

## Features

- Select multiple branches from a list
- Execute any command synchronously
- Return to origin branch after finish
