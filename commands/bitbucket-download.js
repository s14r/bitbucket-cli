const axios = require('axios')
const ora = require('ora')
const prettyjson = require('prettyjson')
const fs = require('fs')
const stream = require('stream')
const {promisify} = require('util')
const finished = promisify(stream.finished);


module.exports = ({ program }) => {
  let client = null

  const reviewers = []

  const addReviewer = (value) => {
    reviewers.push(value)
  }

  const fetchDescription = function (source, target) {
    return client.get(`/commits/${source}`, {
      params: {
        exclude: target
      }
    })
      .then((r) => {
        const messages = r.data.values.map(commit => commit.rendered.message.raw)
          .join("\n\n")

        return [
          '# Included Messages (combined automatically)',
          messages
        ].join('\n\n\n')
      })
      .catch(() => 'No fetchable Data')
  }

  program
    .description('Download file from bitbucket download')
    .arguments('<work-space> <repo-slug> <filename>')
    .option('-u, --username <username>', 'Username to connect to bitbucket')
    .option('-p, --password <password>', 'Password to connect to bitbucket')
    .option('-o, --output <output>', 'Output path for file')
    .action((workspace, repoSlug, filename, cmd) => {
      cmd.output ??= filename
 
      const spinner = ora(`Download Bitbucket Request at ${repoSlug}`).start()

      client = axios.create({
        baseURL: `https://api.bitbucket.org/2.0/repositories/${workspace}/${repoSlug}`,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        withCredentials: true,
        auth: {
          username: cmd.username,
          password: cmd.password
        },
        responseType: 'stream'
      })

      
      client.get(`/downloads/${filename}`)
        .then((r) => {
            downloadFile(r.data.responseUrl,cmd.output)
            .then((e)=>{
              spinner.succeed('Successfully Downloaded File ')
              process.exit()
            });

        })
        .catch((e) => {
          console.log(e);
          spinner.fail('Failed to download file ' + e.response.status + ": " + e.response.statusText)

          if (cmd.fail) {
            process.exit(1)
          }
        })
    })
}


async function downloadFile(fileUrl, outputLocationPath) {
  const writer = fs.createWriteStream(outputLocationPath);
return axios({
    method: 'get',
    url: fileUrl,
    responseType: 'stream',
  }).then(async response => {
    response.data.pipe(writer);
    return await finished(writer);
  });
}
