// @ts-check
const commands = {
   'kick': {
      description: 'Kicks the user',
      usage: '!kick @user',
      needMention: true,
      needArgs: false,
      execute(message) {
         const member = message.mentions.members.first()
         member.kick()
            .then(userName => message.channel.send(`${userName} kicked.`))
            .catch(() => message.channel.send(`Couldn't kick ${member}`));
      }
   },
   'user-info': {
      description: 'Gets user info',
      usage: '!user-info @user',
      needArgs: false,
      needMention: true,
      execute(message) {
         const member = message.mentions.members.first()
         message.channel.send(`
            Username: ${member.user.username}
            \nDisplay name: ${member.displayName}
            \nId: ${member.id}
            \nPermissions: ${member.permissions}
            \nRoles: ${member.roles}`
         )
      }
   },
   'command-args': {
      description: 'Command-args command',
      usage: '!user-info @user',
      needMention: false,
      needArgs: true,
      execute(message, args) {
         message.channel.send(`Command: ${this.name} \nArgs: ${args}`)
      }
   },
   'guild': {
      description: 'Guild command',
      usage: '!user-info @user',
      needMention: false,
      needArgs: false,
      execute(message) {
         message.channel.send(`Guild: ${message.guild.name}`)
      }
   },
   'avatar': {
      description: 'Avatar command',
      usage: '!user-info @user',
      needMention: false,
      needArgs: false,
      execute(message) {
         if (!message.mentions.users.size) {
            return message.channel.send(`Your avatar: ${message.author.displayAvatarURL}`)
         }
         const avatars = message.mentions.users.map(user => `${user.username}'s avatar: ${user.displayAvatarURL}`)
         message.channel.send(avatars)
      }
   },
   'delete': {
      description: 'Prune command',
      usage: '!user-info @user',
      needMention: false,
      needArgs: true,
      execute(message, args) {
         const ammount = parseInt(args[0])
   
         if (isNaN(ammount)) return message.channel.send('Parameter needs to be a number')
         if (ammount < 2 || ammount > 100) return message.channel.send('Parameter needs to be between 2 and 100')
   
         message.channel
            .bulkDelete(ammount, true)
            .catch(err => console.log(err))
      }
   },
   'help': {
      description: 'Prune command',
      usage: '!user-info @user',
      needMention: false,
      needArgs: false,
      execute(message) {
         const commandMsgs = []
         for (const key in commands) {
            if (commands.hasOwnProperty(key)) {
               commandMsgs.push(`\n${key}: ${commands[key].description}. Usage: ${commands[key].usage}`)
            }
         }
         message.channel.send(`Commands: ${commandMsgs}`)
      }
   },
   'change-name': {
      description: 'Change the username',
      usage: '!user-info @user',
      needMention: true,
      needArgs: true,
      execute(message, args) {
         let userName = null
         if (args.length === 2 ) {
            userName = args[1]
         }
         if (args.length > 2 ) {
            const [, ..._userName] = args
            userName = _userName.join(' ')
         }
         
         const member = message.mentions.members.first()
         if (userName !== null) {
            member.setNickname(userName)
               .then(() => console.log('Username changed to ' + userName))
               .catch(err => console.log(err))
         }
      }
   },
   'random-names': {
      description: 'Change usernames',
      usage: '!user-info @user',
      needMention: false,
      needArgs: false,
      execute(message) {
         const members = message.guild.members
         const funnyNames = [
            'Feto de pato','Puré de cera','Mierda asada','Yogur de callos','Tarta de anchoas','Batido de conejo',
            'Moho en las uñas','Helado de paté','Pizza con platano',
            'Leche con bacalao', 'Coño de tu abuela', 'Pulpo crudo']

         members.forEach(member => {
            const index = Math.floor(Math.random() * funnyNames.length)
            const userName = funnyNames.splice(index, 1)[0]

            member.setNickname(userName)
               .then(() => console.log('Usernames changed '))
               .catch(err => console.log(err))
         });
      }
   },
}

module.exports = commands
