const fs = require('fs')
const path = require('path')
const commander = require('commander')
const pkg = require('./package.json')

/**
 * Helping Hand for running programs from a given directory
 */
class Runner {

  /**
   * Just for convenience :)
   *
   * @param commandsPath
   * @returns {Runner}
   */
  static make (commandsPath) {
    return new this(commandsPath)
  }

  /**
   * Create a new Runner instance
   *
   * @param commandsPath {string} - the path to load commands from
   */
  constructor (commandsPath) {
    this._loadCommands(commandsPath)
  }

  /**
   * Load Commands from the given path
   *
   * @param commandsPath {string} - the path to load commands from
   * @private
   */
  _loadCommands (commandsPath) {
    const commands = fs.readdirSync(commandsPath)
    for (let index in commands) {
      const commandName = path.basename(commands[index], '.js')
      const fn = require(commandsPath + '/' + commands[index])
      const program = commander.command(commandName)

      fn({ program })
    }
  }

  /**
   * Parses Arguments and runs commands
   */
  run () {
    commander
      .version(`Bitbucket CLI ${pkg.version}`)
      .parse(process.argv)

    if (!process.argv.slice(2).length) {
      commander.outputHelp()
    }
  }
}

module.exports = Runner
