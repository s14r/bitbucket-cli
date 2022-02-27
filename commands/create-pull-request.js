const axios = require('axios')
const ora = require('ora')
const prettyjson = require('prettyjson')
const BitbucketClient = require('../lib/bitbucket-client')
const createPullRequest = require('../actions/create-pull-request')

/**
 * Deprecated, use `bitbucket-cli repository create-pull-request` instead
 * @param program
 */
module.exports = ({ program }) => {

  program
    .description('Create a Bitbucket PR (deprecated, use `repository create-pull-request` instead)')
    .arguments('<repo-slug> <title>')
    .option('-s, --source <source>', 'Source Branch', 'develop')
    .option('-t, --target <target>', 'Target Branch', 'master')
    .option('-r, --reviewer <reviewer...>', 'Add one or more reviewers by username (only Username works), use once with comma-separated values or multiple times')
    .option('-d, --description <description>', 'Describe the PR, supports Markdown or leave it to us to generate a comprehensive description')
    .option('-u, --username <username>', 'Username to connect to bitbucket')
    .option('-p, --password <password>', 'Password to connect to bitbucket')
    .option('--keep-branch', 'Should BB keep the branch open after merge?')
    .option('--no-fail', 'Command will not exit with code != 0 even on failure')
    .option('--debug', 'Output message to be sent to Bitbucket API')
    .action(async (repoSlug, title, opts) => {

      // use an external fn as we use this from two commands due to backwards compatibility
      await createPullRequest(
        opts.username,
        opts.password,
        repoSlug,
        opts.source,
        opts.target,
        title,
        opts.description,
        opts.reviewer,
        opts.keepBranch,
        opts.fail
      )
    })
}

