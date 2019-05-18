# Bitbucket CLI
This bitbucket CLI tool is a simple and minimal helper to interact with Bitbucket via its public API. 

In all honesty, at the moment you can only create PRs with it ✌️but... who knows :)

**Motivation**
I needed a simple way to create PRs via our Bitbucket Pipelines Scripts and therefore I just created this super simple CLI tool.
We use the public docker image to easily integrate it to our Pipelines so feel free.

## Some details about testing
There are no tests as this is just a simple mini pet project including just a few lines of code.

## Security
We're using simple BASIC auth and no sophisticated OAuth stuff here just to warn you :)

## How to use it
The recommended way is to use the (again, very simple) docker image to run a command.

```sh
docker run sebric/bitbucket-cli:latest {COMMAND_NAME} --help
```

Nevertheless, there might be a outdated version at npm also.
```sh
npm install --global bitbucket-cli
bitbucket-cli --version
```

## Commands

### create-pull-request
Well... It creates a PR for you.

```sh
Usage: create-pull-request [options] <repo-slug> <title>

Create a Bitbucket PR

Options:
  -s, --source <source>            Source Branch (default: "develop")
  -t, --target <target>            Target Branch (default: "master")
  -r, --reviewer <reviewer>        Add one or more reviewers by username (only Username works), use once with comma-separated values or multiple times
  -d, --description <description>  Describe the PR, supports Markdown
  -u, --username <username>        Username to connect to bitbucket
  -p, --password <password>        Password to connect to bitbucket
  --keep-branch                    Should BB keep the branch open after merge?
  -h, --help                       output usage information
```
