const Command = require("../../base/Command.js");
const exec = require("child_process").exec;

class Exec extends Command {
	constructor(client) {
		super(client, {
			name: "exec",
			description: "Executes command line code",
			usage: "exec <cmd>",
			ownerOnly: true,
			category: "Owner",
			extended: "Executes any command line code for bot owner only.",
		});
	}

	run(message, args) {
		exec(`${args.join(" ")}`, (error, stdout) => {
			const response = (error || stdout);
			message.channel.send(`Ran: ${args.join(" ")}\n${response}`, { code: "asciidoc", split: "\n"}).catch(console.error);
		});
	}
}

module.exports = Exec;

