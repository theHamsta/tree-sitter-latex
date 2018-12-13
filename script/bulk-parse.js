const fs = require('fs')
const Parser = require('tree-sitter')
const language = require('..')
const readdir = require('readdir-enhanced')
const path = require('path')
const chalk = require('chalk')

const root = process.argv[2]
let failure_count = 0

readdir.stream(root, { deep: true, filter: '**/*.{cls,tex,sty}' })
  .on('data', () => {})
  .on('file', (filePath) => {
    const code = fs.readFileSync(path.join(root, filePath), 'utf8')
    let document = null
    parser = new Parser()
    parser.setLanguage(language)
    document = parser.parse(code)
    if (document.rootNode.hasError()) {
      console.log(chalk.red(`\u2717 ${filePath}`))
      failure_count++
    } else {
      console.log(chalk.green(`\u2713 ${filePath}`))
    }
  })
  .on('end', () => {
    if (failure_count === 0) {
      console.log(chalk.green('\nAll files parsed successfully.'))
    } else {
      console.log(chalk.red(`\nParsing failed on ${failure_count} files.`))
      process.exit(1)
    }
  })
