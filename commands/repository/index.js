module.exports = ({ program }) => {
  program
    .description('Repository Command Group')

    // will be passed through to sub commands
    .argument('<repo-slug>', 'Repository Slug, also include your workspace like {Workspace}/{Slug}')
    .requiredOption('-u, --username <username>', 'Username to connect to bitbucket')
    .requiredOption('-p, --password <password>', 'Password to connect to bitbucket')
}
