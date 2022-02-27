const ora = require('ora')
const BitbucketClient = require('../lib/bitbucket-client')
const prettyjson = require('prettyjson')

/**
 * Extracted to have backwards compatibility for older command structure
 *
 * @param {String} username - the username for BB
 * @param {String} password - the password to use to connect to BB
 * @param {String} repoSlug - the slug (with workspace and repo)
 * @param {String} sourceBranch - name of the source branch
 * @param {String} targetBranch - name of the target branch
 * @param {String} title - The title of the new PR
 * @param {String} description - The description, we generate something if nullish
 * @param {String[]} reviewers - List of usernames to attach as PR Reviewers
 * @param {Boolean} keepBranch - Should the branch NOT be closed?
 * @param {Boolean} shouldFail - The command would return zero exit code even on fail if set to false
 *
 * @returns {Promise<void>}
 */
const createPullRequest = async function (
  username,
  password,
  repoSlug,
  sourceBranch,
  targetBranch,
  title,
  description = null,
  reviewers = [],
  keepBranch = false,
  shouldFail = true
) {
  const spinner = ora(`Creating Pull Request at ${repoSlug}`).start()
  const client = BitbucketClient.withCredentials(repoSlug, username, password)

  const exit = (failed = false) => {
    if (failed && shouldFail) {
      process.exit(1)
    }

    process.exit(0)
  }

  // check if target branch is available
  try {
    await client.getBranchDetails(targetBranch)
  } catch (err) {
    if (err.response.status === 404) {
      spinner.fail(`Target Branch ${targetBranch} does not exist`)
    } else {
      spinner.fail('Failed checking target branch ' + err.response.status)
      console.log(prettyjson.render(err.response.data, { keysColor: 'red' }))
    }

    exit(true)
  }

  // can be used as `--reviewer username1 --reviewer username2` or `--reviewer username1,username2`
  reviewers = reviewers.reduce((memo, r) => memo.concat(r.split(',')), [])

  // if we do not have a given description, we are going to use the generated one
  description = await (typeof description === 'string'
    ? Promise.resolve(description)
    : client.fetchCommitDescription(sourceBranch, targetBranch))

  try {
    const r = await client.createPullRequest(title, sourceBranch, targetBranch, description, reviewers, keepBranch)

    spinner.succeed('Successfully created PR ' + r.data.links.html.href)

  } catch (err) {
    spinner.fail('Failed creating PR with Status ' + err.response.status)
    console.log(prettyjson.render(err.response.data, { keysColor: 'red' }))

    exit(true)
  }

  exit()
}

module.exports = createPullRequest
