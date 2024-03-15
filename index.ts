import fs from 'fs'
import { Client, GatewayIntentBits, Collection } from 'discord.js'
import { logger } from './logger.js'

interface CustomClient extends Client {
  commands: Collection<string, any>
}

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
}) as CustomClient

client.commands = new Collection()
const commandFiles = fs.readdirSync('./commands').filter((file) => file.endsWith('.js'))

for (const file of commandFiles) {
  const command = require(`./commands/${file}`)
  client.commands.set(command.data.name, command)
}

const eventFiles = fs.readdirSync('./events').filter((file) => file.endsWith('.js'))

for (const file of eventFiles) {
  const event = require(`./events/${file}`)
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args))
  } else {
    client.on(event.name, (...args) => event.execute(...args))
  }
}

await client.login(process.env.DISCORD_TOKEN).then(() => {
  if (client.user) logger.info(`Logged into Discord as ${client.user.tag}`)
})
