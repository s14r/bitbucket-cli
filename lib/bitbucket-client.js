const axios = require('axios')
const fs = require('fs')
const { promisify } = require('util')
const stream = require('stream')
const prettyjson = require('prettyjson')
const finished = promisify(stream.finished)

/**
 * Default Axios config for all requests
 *
 * @type {*}
 */
const AXIOS_CONFIG = {
  baseURL: `https://api.bitbucket.org/2.0`,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  },
  responseType: 'json'
}

class BitbucketClient {

  /**
   * Creates a new BB Client with username and password
   *
   * @param {String} repository - the repository slug
   * @param {String} username - the username to authenticate with
   * @param {String} password - obviously the password
   * @returns {BitbucketClient}
   */
  static withCredentials(repository, username, password) {
    return new this(`/repositories/${repository}`, {
      withCredentials: true,
      auth: {
        username,
        password
      }
    })
  }

  /**
   * Creates from options
   *
   * @param opts
   */
  static fromOptions(repoSlug, opts) {
    return this.withCredentials(repoSlug, opts.username, opts.password)
  }

  /**
   * Creates a new client
   *
   * @param {String} path - path for the client
   * @param {{}} axiosConfig - additional axios config witch is merged with the default one
   */
  constructor(path, axiosConfig = {}) {
    const config = Object.assign({}, AXIOS_CONFIG, axiosConfig)
    config.baseURL = config.baseURL + path

    this._client = axios.create(config)
  }

  /**
   * Returns the commit descriptions from `source` to `target` combined as string
   *
   * @param sourceBranch
   * @param targetBranch
   * @returns {Promise<T | string>}
   */
  async fetchCommitDescription(sourceBranch, targetBranch) {
    return this._client.get(`/commits/${sourceBranch}`, {
      params: {
        exclude: targetBranch
      }
    })
      .then((r) => {

        const messages = r.data.values.map(commit => {
          const lines = commit.rendered.message.raw.split('\n')

          return [
            `**${lines[0]}**\n`,
          ]
            .concat(lines.slice(1).map(l => `> ${l}`))
            .join('\n')
        })
          .join('\n\n')

        return [
          '# Included Messages (combined automatically)',
          messages
        ].join('\n\n\n')
      })
      .catch((err) => {
        return 'No fetchable Data'
      })
  }

  async createPullRequest(title, sourceBranchName, targetBranchName, description = null, reviewers = [], closeBranch = true) {
    const request = {
      title: title,
      close_source_branch: closeBranch,
      source: {
        branch: {
          name: sourceBranchName
        }
      },
      destination: {
        branch: {
          name: targetBranchName
        }
      }
    }

    if (description) {
      request.description = description
    }

    if (reviewers.length) {
      request.reviewers = reviewers.map(r => ({ username: r }))
    }

    return this._client.post('/pullrequests', request)
  }

  async download(filename, targetFile) {
    const writer = fs.createWriteStream(targetFile)

    return this._client.get(`/downloads/${filename}`, {
      responseType: 'stream',
      transformRequest: (data, headers) => {
        // required to be removed as we are redirect to a signed s3 URL
        delete headers['Accept']
        delete headers['Content-Type']
      }
    }).then(r => {
      return new Promise((resolve, reject) => {
        let error = null
        r.data.pipe(writer)

        writer.on('error', err => {
          error = err
          writer.close()
        })

        writer.on('close', () => {
          if (error) {
            reject(error)
          }

          resolve(true)
        })
      })
    })
  }

  async getBranchDetails(branch) {
    return this._client.get(`refs/branches/${branch}`)
  }
}

module.exports = BitbucketClient
