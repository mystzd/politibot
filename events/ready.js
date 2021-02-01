module.exports = (client) => {
	console.log(`
#####{ Bot Ready }#####
Username: ${client.user.tag}
Bot ID: ${client.user.id}
Servers: ${client.guilds.cache.size}
Users: ${client.guilds.cache.size}
Channels: ${client.channels.cache.size}
#######################`.trim());
	client.user.setActivity(`pb.help for commands`);
};
