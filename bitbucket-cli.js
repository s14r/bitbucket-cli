const fs = require('fs')
const path = require('path')
const { Command } = require('commander')
const pkg = require('./package.json')

/**
 * Helping Hand for running programs from a given directory
 */
class BitbucketCli {

  /**
   * Just for convenience :)
   *
   * @param commandsPath
   * @returns {BitbucketCli}
   */
  static make(commandsPath) {
    return new this(commandsPath)
  }

  /**
   * Create a new Runner instance
   *
   * @param commandsPath {string} - the path to load commands from
   */
  constructor(commandsPath) {
    this._root = new Command('bitbucket-cli')
    this._root
      .version(`Bitbucket CLI ${pkg.version}`)
      .description('Simplest CLI you can ever get :D')

    this._loadCommands(commandsPath, this._root, [this._root])
  }

  /**
   * Load Commands from the given path
   *
   * @param commandsPath {string} - the path to load commands from
   * @param program
   * @private
   */
  _loadCommands(commandsPath, program, configPrograms = []) {
    const entries = fs.readdirSync(commandsPath, { withFileTypes: true })

    entries.forEach(entry => {

      // we are loading subcommand
      if (entry.isDirectory()) {
        const configureGroupCommand = require(path.join(commandsPath, entry.name, 'index.js'))

        // group command
        const pseudoGroupCommand = new Command(entry.name)

        // configure the pseudo command
        configureGroupCommand({ program: pseudoGroupCommand })

        // create the real group command
        const groupCommand = new Command(entry.name)

        // clone description
        groupCommand.description(pseudoGroupCommand.description())

        // we will take arguments and options from there
        configPrograms.push(pseudoGroupCommand)

        // load sub commands into the group
        this._loadCommands(path.join(commandsPath, entry.name), groupCommand, configPrograms)

        // append the group to the root command
        program.addCommand(groupCommand)
      } else if (entry.name !== 'index.js') {
        // we are loading commands from a dir
        const configureCommand = require(path.join(commandsPath, entry.name))
        const command = new Command(path.basename(entry.name, '.js'))

        // configure with our config programms first
        configPrograms.forEach(configProgram => {
          // may break as this is a private propery
          configProgram._args.forEach(arg => command.addArgument(arg))
          configProgram.options.forEach(opt => command.addOption(opt))
        })

        configureCommand({ program: command })

        program.addCommand(command)
      }
    })
  }

  /**
   * Parses Arguments and runs commands
   */
  run() {
    this._root.parse(process.argv)

    if (!process.argv.slice(2).length) {
      this._root.outputHelp()
    }
  }
}

module.exports = BitbucketCli
