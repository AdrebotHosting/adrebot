const Discord = require('discord.js');
const client = new Discord.Client();
const settings = require('./settings.json');
const weather = require('weather-js');

client.commands = new Discord.Collection();

var prefix = "a!";

client.on("ready", () => client.user.setPresence({ status: "dnd", game: {name: `v0.7 | a!help`} }));
  console.log(`Still same beautiful!`);

    client.on("guildMemberAdd", function(member) {
        var guildchannel = member.guild.channels.find("name", "logs");
        if (!guildchannel) {
          return;
        }
        var connect = new Discord.RichEmbed()
        .setColor(0x00FF00)
        .setTitle(`Member Joined`)
        .addField(`${member}`, `${member.id}`)
        .setTimestamp()
        var logschannel = client.channels.find("name", "logs");

        member.guild.channels.find("name", "logs").sendEmbed(connect);
    });

    client.on("guildMemberRemove", function(rmember) {
        var guildchannel = rmember.guild.channels.find("name", "logs");
        if (!guildchannel) {
          return;
        }
        var disconnect = new Discord.RichEmbed()
        .setColor(0xFF0000)
        .setTitle(`Member Left`)
        .addField(`${rmember}`, `${rmember.id}`)
        .setTimestamp()
        var logschannel = client.channels.find("name", "logs");

        rmember.guild.channels.find("name", "logs").sendEmbed(disconnect);
    });

    client.on("guildCreate", guild => {
  console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
});

client.on("guildDelete", guild => {
  console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
});

client.on("message", async message => {
  if (message.author.equals(client.user)) return;
  if (!message.content.startsWith(prefix)) return;
  var args = message.content.slice(prefix.length).split(" ");
  let sender = message.author; // This variable takes the message, and finds who the author is.
  let cmd = args.shift().toLowerCase();

   if (message.channel.type === 'dm') return message.channel.send("Commands are ment to do in a guild. Thanks :blush:!");

    console.log(`${message.author.username} ran the command: ${cmd}`);

    if (message.content.startsWith(prefix + "help")) {
     message.delete();
     message.reply("check your DM | :postbox:").then((botrpl) => botrpl.delete(20000));
     var help = new Discord.RichEmbed()
     .setColor(0xffffff)
     .setImage("https://media.discordapp.net/attachments/375276909568720906/407177755835367425/adrebotlittle.png")
     .addField("Here you see all AdreBot's commands.", "**Maintenance commands:**\n`a!purge [Amount]\na!warn [Member] [Warning]\na!kick [Member] [Reason]\na!say [Message]\na!embed [Message]\na!text [Channel name]\na!voice [Voicechannel name]\na!addrole [Member] [Rolename]`\n\n**User commands:**\n`a!ping\na!feedback (feedback/issue/error)\na!stats\na!binfo\na!invite\na!avatar [Member]\na!weather [Place name]\na!8ball [Question]\na!membercount`")
     .setTitle("Thank you for using AdreBot.")
     .setTimestamp()
     message.author.sendEmbed(help);
     };

    if (message.content.startsWith(prefix + "membercount")) {
    let online = message.guild.members.filter(e => e.user.presence.status === "online").size;let idle = message.guild.members.filter(e => e.user.presence.status === "idle").size;let dnd= message.guild.members.filter(e => e.user.presence.status === "dnd").size;(online + idle + dnd)
    var membercount = new Discord.RichEmbed()
    .setColor(0xffffff)
    .addField("Members", `${message.guild.memberCount}`)
    .addField("Bots", `${message.guild.members.filter(e => e.user.bot === true).size}`)
    .addField("Humans", `${message.guild.members.filter(e => e.user.bot === false).size}`)
    .addField("Online", `${online}`)
    message.channel.sendEmbed(membercount)
  };

  if (message.content.startsWith(prefix + "voice")) {
   if (!message.member.hasPermission('ADMINISTRATOR')) return message.channel.send('This requires you to have a role with `Administrator`!')
    var voicechannelname = args.slice(0).join(" ");
    message.guild.createChannel(`${voicechannelname}`, "voice").catch(console.error);
    var voicechannel1 = new Discord.RichEmbed()
    .setColor(0x00FF00)
    .setDescription(`*Voicechannel **${voicechannelname}** has succesfully been created!*`)
    .setTimestamp()
    message.channel.sendEmbed(voicechannel1).catch(console.error);
  };

   if (message.content.startsWith(prefix + "text")) {
   if (!message.member.hasPermission('ADMINISTRATOR')) return message.channel.send('This requires you to have a role with `Administrator`!')
     var channelname = args.slice(0).join(" ");
     message.guild.createChannel(`${channelname}`, "text")
     var ctext = new Discord.RichEmbed()
     .setColor(0x00FF00)
     .setDescription(`*Channel **#${channelname}** has succesfully been created!*`)
     .setTimestamp()
     message.channel.sendEmbed(ctext).catch(console.error);
  };

   if (message.content.startsWith(prefix + "addrole")) {
   if (!message.member.hasPermission('ADMINISTRATOR')) return message.channel.send('This requires you to have a role with `Administrator`');
   var rolename = args.slice(0).join(" ");
   var role = message.guild.roles.find("name", `${rolename}`).catch(console.error);
   var member = message.mentions.members.first();
   member.addRole(role).catch(console.error);
   var addrole1 = new Discord.RichEmbed()
   .setColor(0x00FF00)
   .setTitle(`${rolename} has succesfully given to ${member}`)
   .setTimestamp()
   };

if (message.content.startsWith(prefix + "ping")) {
  const m = await message.channel.sendMessage("I think I'm pinging :thinking:");
 var ping = new Discord.RichEmbed()
 .setColor(0xFF0000)
 .setDescription(`**Pong :ping_pong:! Latency is \`${m.createdTimestamp - message.createdTimestamp} ms\`.\nAPI Latency is \`${Math.round(client.ping)} ms\`**`)
 .setFooter(`${message.author.username}#${message.author.discriminator}`)
 .setTimestamp()
 message.channel.sendEmbed(ping);
};

if (message.content.startsWith(prefix + "kick")) {
   if (!message.member.hasPermission('ADMINISTRATOR')) return message.channel.send('This requires you to have a role with `Administrator`!')
   if(message.mentions.users.size === 0) {
     return message.reply("please mention a user to kick.").catch(console.error);
    }
    let kickMember = message.guild.member(message.mentions.users.first());
    if(!kickMember) {
    return message.reply("that user does not seem valid.");
    }
    if(!message.guild.member(client.user).hasPermission("KICK_MEMBERS")) {
      return message.reply("I don't have permission \`Kick Members\` to do this!").catch(console.error);
    }
    kickMember.kick().then(member => {
      let text = args.slice(1).join(" ");
      let kick1 = new Discord.RichEmbed()
      .setColor(0xFFA200)
      .setDescription(`**Action: **\`KICK\`\n\n**__Kicked user:__** \`${member.user.username}#${member.user.discriminator}\`\n**__Moderator:__** \`${message.author.username}#${message.author.discriminator}\`\n**__Reason:__** ${text}`)
      .setFooter(`${message.author.tag}`)
      .setTimestamp()
      message.guild.channels.find("name", "mod-log").sendEmbed(kick1);
      let kick2 = new Discord.RichEmbed()
      .setColor(0xFFA200)
      .setDescription(`**${message.author.tag}** *kicked you from* **${member.guild.name}**!\n**Reason: ${text}**`)
      .setFooter(`${message.author.tag}`)
      .setTimestamp()
      member.user.sendEmbed(kick2);
      }).catch(console.error);
    }

   if (message.content.startsWith(prefix + "warn")) {
     message.delete();
   if (!message.member.hasPermission('ADMINISTRATOR')) return message.channel.send('This requires you to have a role with `Administrator`!')
      var member = message.guild.member(message.mentions.users.first());
      if (!member) {
          return message.channel.send("You didn't mention any user!");
      }
      var text = args.slice(1).join(" ");
      var warning = new Discord.RichEmbed()
      .setColor(0xFFFF00)
      .setDescription(`**Action: **\`WARN\`\n\n**__Warned user:__** \`${member.user.username}#${member.user.discriminator}\`\n**__Moderator:__** \`${message.author.username}#${message.author.discriminator}\`\n**__Reason:__** ${text}`)
      .setFooter(`${message.author.tag}`)
      .setTimestamp()
      message.guild.channels.find("name", "mod-log").sendEmbed(warning);
      var warningsend = new Discord.RichEmbed()
      .setColor(0xFFFF00)
      .setDescription(`**${message.author.username}#${message.author.discriminator}** warned you in the **${member.guild.name}** server!\n**Reason: ${text}**`)
      .setFooter(`${message.author.tag}`)
      .setTimestamp()
      member.user.sendEmbed(warningsend);
    };

    if (message.content.startsWith(prefix + "say")) {
       if (!message.member.hasPermission('ADMINISTRATOR')) return message.channel.send('This requires you to have a role with `Administrator`!')
        if (args.length === 0) {
         return message.channel.send('Specify something you wan\'t me to say.');
    }
        message.delete();
        message.channel.send(args.slice(0).join(" "));
    }

    if (message.content.startsWith(prefix + "embed")) {
      if (!message.member.hasPermission('ADMINISTRATOR')) return message.channel.send('This requires you to have a role with `Administrator`!')
       if (args.length === 0) {
         return message.channel.send('Specify something you wan\'t me to say.');
    }

        message.delete();
        var text = args.slice(0).join(" ");
        var embedmessage = new Discord.RichEmbed()
        .setColor(0x2ECCFA)
        .setDescription(`${text}`)
        message.channel.sendEmbed(embedmessage)

      };

if (message.content.startsWith(prefix + "feedback")) {
    message.delete();
    message.channel.send("Succesfully sent a feedback. ")
    var msg = args.slice(0).join(" ");
    var appeal = new Discord.RichEmbed()
    .setColor(0xFF0000)
    .addField(`${message.author.username}#${message.author.discriminator} sent feedback!`, `<@&375627616985677825> :eyes:`)
    .setDescription(`**Feedback: ${msg}**`)
    .setTimestamp()
    client.channels.get("374295390478008340").sendEmbed(appeal);
    var appeal1 = new Discord.RichEmbed()
    .setColor(0xFF0000)
    .addField(`${message.author.user}#${message.author.discriminator}`, `Thank you for your feedback.`)
    .setTimestamp()
    member.user.sendEmbed(appeal1);
  };

if (message.content.startsWith(prefix + "version")) {
    message.delete();
    var version = new Discord.RichEmbed()
    .setColor(0x800080)
    .setTitle("**Version 0.7**")
    .addField("**Added:**", "a!addrole, a!takerole, a!createrole, a!removerole & a!feedback (old send)")
    .addField("**Removed:**", "Nothing")
    .addField("**Repaired:**", "a!help (Added all commands)")
    .setTimestamp()
    message.channel.sendEmbed(version);
};

if (message.content.startsWith(prefix + "invite")) {
    message.delete();
    var invite = new Discord.RichEmbed()
    .setColor(0xFFFFFF)
    .addField("Thank you for adding **AdreBot** to your server", "[Click here to add AdreBot to your server](http://bit.ly/adrebot)")
    .setFooter(`${message.author.username}#${message.author.discriminator}`)
    .setImage(client.user.avatarURL)
    .setTimestamp()
    message.channel.sendEmbed(invite);
};

if (message.content.startsWith(prefix + "stats")) {
    message.delete();
    var stats = new Discord.RichEmbed()
    .setColor(0xFF0000)
    .setImage("https://cdn.discordapp.com/attachments/375276909568720906/376327142574915585/7066fdba2c0c9db7d1f09684c2b6f7c7_90x90.jpg")
    .setTitle("**BOT STATS**")
    .addField("**Users:**", `${client.users.size}`)
    .addField("**Servers:**", `${client.guilds.size}`)
    .addField("**Channels:**", `${client.channels.size}`)
    .addField("**Discord.js:**", "v11.3.0")
    .addField("**Node:**", "v8.6.0")
    .setFooter(`${message.author.username}#${message.author.discriminator}`)
    .setTimestamp()
    message.channel.sendEmbed(stats);
};

    if (message.content.startsWith(prefix + "8ball")) {
        var text = args.slice(0).join(" ");
        var magicArray = ['It is certain.', 'It is decidedly so.', 'Without a doubt.', 'Yes - definitely.', 'You may rely on it.', 'As I see it, yes.', 'Most likely.', 'Outlook good.', 'Yes.', 'Signs point to yes.', 'Reply hazy, try again.', 'Ask again later.', 'Better not tell you now.', 'Cannot predict now.', 'Concentrate and ask again.', 'I would not count on it.', 'My reply is no.', 'My sources say no.', 'Outlook not so good.', 'Are you done asking questions yet?', 'Why should I even know this?', 'The answer lies within yourself.', 'Why are you asking me?', 'Follow the seahorse.', 'Very doubtful.'];
        var randomReply = Math.floor(Math.random() * magicArray.length);
        var ballz = new Discord.RichEmbed()
        .setColor(0x00ccff)
        .setDescription(`**Question:** *${text}* \n\n**Answer:** *${magicArray[randomReply]}*`)
        .setFooter(`${message.author.username}#${message.author.discriminator}`)
        .setTimestamp()
        message.channel.sendEmbed(ballz);
    }

if (message.content.startsWith(prefix + 'weather')) {
        if (args.length === 0) return message.channel.send('Please specify a location.');
        weather.find({
            search: args.join(" "),
            degreeType: 'C'
        }, function(err, result) {
            if (err) message.channel.send(err);

            if (result.length === 0) {
                message.channel.send('Location not found! Specify a valid location');
                return;
            }

            var current = result[0].current;
            var location = result[0].location;

                var weather = new Discord.RichEmbed()
                .setDescription(`**${current.skytext}**`)
                .setAuthor(`Weather for ${current.observationpoint}`)
                .setThumbnail(current.imageUrl)
                .setColor(0xff9e30)
                .addField('Timezone', `UTC${location.timezone}`, true)
                .addField('Degree Type', location.degreetype, true)
                .addField('Temperature', `${current.temperature} Degrees`, true)
                .addField('Winds', current.winddisplay, true)
                .addField('Humidity', `${current.humidity}%`, true);
                message.channel.sendEmbed(weather);
        });
    }

    if (message.author.equals(client.user)) return;

if (message.content.startsWith(prefix + 'avatar')) {
let messageArray = message.content.split(" ");
let args2 = messageArray.slice(1);
let firstmentioned = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args2[0]);
if (!firstmentioned) return message.channel.send("You did not specify a user mention!");
let fuckme = new Discord.RichEmbed()
.setTitle(`${firstmentioned.user.username}#${firstmentioned.user.discriminator}'s profile picture`)
.setImage(firstmentioned.user.avatarURL)
.setColor(0x7A5D51)
message.channel.sendEmbed(fuckme);
}

if (message.content.startsWith(prefix + "purge")) {
if (!message.member.hasPermission('ADMINISTRATOR')) return message.channel.send('This requires you to have a role with `Administrator`');
const user = message.mentions.users.first();
const amount = !!parseInt(message.content.split(' ')[1]) ? parseInt(message.content.split(' ')[1]) : parseInt(message.content.split(' ')[2])
if (!amount) return message.reply('Must specify an amount to delete!');
if (!amount && !user) return message.reply('must specify a user and amount, or just an amount, of messages to purge!');
message.channel.fetchMessages({
 limit: amount,
}).then((messages) => {
 if (user) {
 const filterBy = user ? user.id : Client.user.id;
 messages = messages.filter(m => m.author.id === filterBy).array().slice(0, amount);
 }
 message.delete();
 message.channel.bulkDelete(messages).catch(error => console.log(error.stack));
message.reply(`deleted ${amount} messages!`)
});
};

if (message.content.startsWith(prefix + "userinfo")) {
    let member = message.guild.member(message.mentions.users.first());
    if (!member) {
        return message.channel.send("Invalid member!");
    }
    var userinfo = new Discord.RichEmbed()
    .addField("Username", `${member.user.username}`)
    .addField("Discord ID", `${member.user.id}`)
    .addField("Registered At", `${member.user.createdAt}`)
    .setColor(0x048BF9)
    .setFooter(`${message.author.username}#${message.author.discriminator}`)
    .setTimestamp()
    message.channel.sendEmbed(userinfo);
};

 });

   client.on('error', (e) => console.error(e));
   client.on('warn', (e) => console.warn(e));

   process.on("unhandledRejection", err => {
   console.error("Uncaught Promise Error: \n" + err.stack);
 });

client.login(process.env.TOKEN);
