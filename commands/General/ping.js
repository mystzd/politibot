const Command = require("../../base/Command.js");

class Ping extends Command {
	constructor(client) {
		super(client, {
			name: "ping",
			description: "Pings the bot",
			usage: "ping",
			extended: "Checks websocket latency"
		})
	}

	run(message, args) {
		message.channel.send("Pong!")
		.then(msg => {
			msg.edit(`Pong! Latency: **${msg.createdTimestamp - message.createdTimestamp}** ms`);
		});
	}
}

module.exports = Ping;
