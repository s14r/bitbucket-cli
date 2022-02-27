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

Nevertheless, there might be an outdated version at npm also.
```sh
npm install --global bitbucket-cli
bitbucket-cli --version
```

## Changes with v0.5.0

- `bitbucket-cli create-pull-request` is deprecated, it can still be used but will be removed in the future. You can
now use the sub-command from the `repository` group: `bitbucket-cli repository create-pull-request`


## Commands

### Creating a Pull Request 
Well... It creates a PR for you.

```sh
Usage: bitbucket-cli repository create-pull-request [options] <repo-slug> <source> <target> <title>

Create a Bitbucket PR

Arguments:
  repo-slug                        Repository Slug, also include your workspace like {Workspace}/{Slug}
  source                           The name of the source branch
  target                           The name of the target branch
  title                            The title for the new PR

Options:
  -V, --version                    output the version number
  -u, --username <username>        Username to connect to bitbucket
  -p, --password <password>        Password to connect to bitbucket
  -d, --description <description>  Describe the PR, supports Markdown or leave it to us to generate a comprehensive description
  -r, --reviewer <reviewer...>     Add one or more reviewers by username (only Username works), use once with comma-separated values or multiple times
  --keep-branch                    Should BB keep the branch open after merge? (default: false)
  --no-fail                        Command will not exit with code != 0 even on failure
  -h, --help                       display help for command

```

### Downloading a `Download` from Bitbucket
Well... It downloads a Bitbucket file from the Bitbucket Downloads

```sh
Usage: bitbucket-cli repository download [options] <repo-slug> <filename> <output>

Download file from bitbucket download

Arguments:
  repo-slug                  Repository Slug, also include your workspace like {Workspace}/{Slug}
  filename                   The Filename as it is shown on the Bitbucket UI
  output                     The path where the file should be downloaded to

Options:
  -V, --version              output the version number
  -u, --username <username>  Username to connect to bitbucket
  -p, --password <password>  Password to connect to bitbucket
  --no-fail                  Command will not exit with code != 0 even on failure
  -h, --help                 display help for command
```
