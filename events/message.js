module.exports = async(client, message) => {

	if (message.author.bot) return; // always ignore bots

	const prefix = client.config.prefix;

	//prefix and perm checks
	if (message.content.indexOf(prefix) !== 0) return;

	if (message.guild) if (!message.guild.me.permissionsIn(message.channel).has("SEND_MESSAGES")) return;

	//args
	const args = message.content.slice(prefix.length).trim().split(/ +/g);
	const command = args.shift().toLowerCase();

	//get the command
	const cmd = client.commands.get(command) || client.commands.get(client.aliases.get(command));
	if(!cmd) return; //fail silently

	//if cmd is disabled, just exit with message
	if(cmd.disabled) return message.reply("Sorry, This command is disabled.");

	//cmd checks
	if(message.guild && cmd.permission && !message.member.permissions.has(cmd.permission) && message.author.id !== client.config.ownerID) return message.reply(`You do not have permissions to use this command. You need \`${cmd.permission.replace("-", " ").toProperCase()}\``).catch(console.error);

	if(message.channel.type === "dm" && cmd.guildOnly) return message.channel.send("This command can only be used in a server.");

	if(cmd.clientPermission && !message.guilde.me.permissions.has(cmd.permission)) return message.reply(`I don't have \`${cmd.permission.replace("-", " ").toProperCase()}\``).catch(console.error);

	if(cmd.ownerOnly && message.author.id !== client.config.ownerID && !cmd.allowed.includes(message.author.id)) return message.reply("This command is for my owner only!");

	if(cmd.allowed.length > 0 && !cmd.allowed.includes(message.author.id) && message.author.id !== client.config.ownerID) return message.reply("You don't have permissions for this.");

	//cooldowns
	const rl = await client.ratelimit(message, cmd.name, cmd.cooldown);
	if(!typeof rl === "string") return message.channel.send(`Please wait ${rl} to run this command again.`);

	//run if all conditions are met
	try {
		cmd.run(message, args);
	} catch(e) {
		console.error(e);
	}
};
