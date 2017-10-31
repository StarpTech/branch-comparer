# branch-comparer
Checkout multiple git Repositorys and execute scripts.
Run benchmark scripts in different repositorys and print them in the console.

## Installation
```
npm i -g branch-comparer
branchcmp
```
## Usage

```
? What's your branches to compare? master, test
? Please enter the command you want to execute in both branches! npm run benchmark
Checking out "master"
Checking out "test"
Execute "npm run benchmark"
v8.8.1
Execute "npm run benchmark"
v8.8.1
```

## Features

- Select multiple branches from a list
- Execute any command synchronously
