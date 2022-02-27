const axios = require('axios')
const ora = require('ora')
const prettyjson = require('prettyjson')
const BitbucketClient = require('../../lib/bitbucket-client')
const createPullRequest = require('../../actions/create-pull-request')

module.exports = ({ program }) => {
  program
    .description('Create a Bitbucket PR')
    .argument('<source>', 'The name of the source branch')
    .argument('<target>', 'The name of the target branch')
    .argument('<title>', 'The title for the new PR')
    .option('-d, --description <description>', 'Describe the PR, supports Markdown or leave it to us to generate a comprehensive description')
    .option('-r, --reviewer <reviewer...>', 'Add one or more reviewers by username (only Username works), use once with comma-separated values or multiple times')
    .option('--keep-branch', 'Should BB keep the branch open after merge?', false)
    .option('--no-fail', 'Command will not exit with code != 0 even on failure', false)
    .action(async (repoSlug, source, target, title, opts) => {
      // use an external fn as we use this from two commands due to backwards compatibility
      await createPullRequest(
        opts.username,
        opts.password,
        repoSlug,
        source,
        target,
        title,
        opts.description,
        opts.reviewer,
        opts.keepBranch,
        opts.fail
      )
    })
}

