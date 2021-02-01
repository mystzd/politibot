class Command {
	constructor(client, {
		name = null,
		description = "No Description",
		extended = "No full description provided",
		usage = "No usage provided",
		category = "General",
		guildOnly = false,
		ownerOnly = false,
		cooldown = 0,
		permission = null,
		aliases = [],
		allowed = [],
		clientPermission = null,
		disabled = false
	}) {
		this.client = client;
		this.name = name;
		this.cooldown = cooldown;
		this.aliases = aliases;
		this.ownerOnly = ownerOnly;
		this.allowed = allowed;
		this.usage = usage;
		this.guildOnly = guildOnly;
		this.category = category;
		this.permission = permission;
		this.clientPermission = clientPermission;
		this.extended = extended;
		this.disabled = disabled;
		this.description = description;
	}

	async run(message, args) {
		message.channel.send(`${this.constructor.name} Does not provide a run method`);
		this.client.logger.warn(`Missing run method in command: ${this.name} class: ${this.constructor.name}`);
	}
}

module.exports = Command;
