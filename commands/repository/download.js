const prettyjson = require('prettyjson')
const fs = require('fs')
const stream = require('stream')
const ora = require('ora')
const { promisify } = require('util')
const finished = promisify(stream.finished)
const BitbucketClient = require('../../lib/bitbucket-client')

module.exports = ({ program }) => {
  program
    .description('Download file from bitbucket download')
    .argument('<filename>', 'The Filename as it is shown on the Bitbucket UI')
    .argument('<output>', 'The path where the file should be downloaded to')
    .option('--no-fail', 'Command will not exit with code != 0 even on failure')
    .action(async (repoSlug, filename, output, options) => {
      const spinner = ora(`Download Bitbucket Request at ${repoSlug}`).start()

      const client = BitbucketClient.withCredentials(repoSlug, options.username, options.password)

      try {
        await client.download(filename, output)
      } catch (err) {
        console.log(err)
        spinner.fail('Failed downloading with status code', err.response.status)
        console.log(prettyjson.render(err, { keysColor: 'red' }))

        if (options.fail) {
          process.exit(1)
        }
      }

      spinner.succeed('Downloaded')

      process.exit()
    })
}



