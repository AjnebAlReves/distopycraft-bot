const fs = require('node:fs')
const path = require('node:path')

function handleTextCommand(message) {
  const textCommandsPath = path.join(__dirname, '../text-commands')
  const textCommandFiles = fs.readdirSync(textCommandsPath).filter(file => file.endsWith('.js'))
  
  for (const file of textCommandFiles) {
    const command = require(path.join(textCommandsPath, file))
    if (message.content.toLowerCase().startsWith('!' + command.name) || (command.aliases && command.aliases.some(alias => message.content.toLowerCase().startsWith('!' + alias)))) {
      return command.execute(message)
    }
  }
  
  return false
}

module.exports = { handleTextCommand }