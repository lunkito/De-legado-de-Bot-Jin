// @ts-check
const { token, prefix } = require('./config.js')
const Discord = require('discord.js')
const commands = require('./commands')
const _knownUsers = require('./trolleables')

const client = new Discord.Client()
let knownUsers = []

// Add property commands to client as Map<name, command> 
Object.defineProperty(client, 'commands', {
   value: new Map(),
   writable: true
})

// Add imported custom commands to the clients.commands property
for (const key in commands) {
   if (commands.hasOwnProperty(key)) {
      client['commands'].set(key, commands[key])
   }
}

client.on('message', message => {

   if (message.author.bot) return

   const isUnknownUser = knownUsers.some(user => message.author.username === user.username)
   if (!isUnknownUser) {
      message.channel.send('Ha gaaay')
   }

   if (!message.content.startsWith(prefix)) return

   const args = message.content.slice(prefix.length).split(/ +/)
   const commandName = args.shift().toLowerCase()

   if (!client['commands'].has(commandName)) return

   const command = client['commands'].get(commandName)

   if (command.needArgs && !args.length) {
      return message.channel.send(`The ${command} command needs arguments`)
   }
   if (command.needMention && !message.mentions.members.size) {
      return message.channel.send(`The ${command} command needs @mention`)
   }

   try {
      command.execute(message, args)
   } catch (error) {
      message.channel
         .send(`Command ${command} not found. If you want to see a list of commands, type !help`)
         .catch(err => console.log('Error sending message. Error: ' + err))
      console.log(error);
   }
})

client.once('ready', () => console.log('ready'))

client.login(token)
   .then(() => knownUsers = fetchKnownUsers())
   .catch(err => console.log(`Error in login. ` + err))

const fetchKnownUsers = () => {
   const result = [];
   for (const trolleable in _knownUsers) {
      if (_knownUsers.hasOwnProperty(trolleable)) {
         const user = _knownUsers[trolleable];

         client.fetchUser(user.id)
            .then(user => result.push(user))
            .catch(err => console.log(err))
      }
   }
   return result
}