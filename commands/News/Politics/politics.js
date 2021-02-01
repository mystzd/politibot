const Command = require("../../../base/Command.js");
const { RichEmbed } = require('discord.js');
const fetch = require('node-fetch');
const Discord = require('discord.js');
const keys = require('../../../rapidapikeys.js')

class politicsSearch extends Command {
	constructor(client) {
		super(client, {
			name: 'politics',
			description: 'Fetches various political news',
			guildOnly: false,
			ownerOnly: false,
			category: 'News',
			extended: 'Fetches various political news based on your parameters'
		})
	}

	async run(message, args) {
		message.channel.send(args.join(" "));
	}
}

module.exports = politicsSearch;
