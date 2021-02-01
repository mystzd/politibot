const Command = require("../../../base/Command.js");
const { RichEmbed } = require('discord.js');
const fetch = require('node-fetch');
const Discord = require('discord.js');
const keys = require('../../../rapidapikeys.js');
const request = require('request');

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
		const filter = m => message.author.id;
		message.channel.send("Please enter a search term. Up to 10 characters. You have 10 seconds to complete this action.").then(() => {
			message.channel.awaitMessages(filter, {
				max: 1,
				time: 10000,
				errors: ['time']
			})
			.then(message => {
				message = message.first();
				const messageSearch = message;
				const messageSearchTable = {
					"word": `${messageSearch.content}`
				}
				message.channel.send(`You have chosen to search about \`${messageSearch.content}\`.`).then(() => {
					message.channel.send("Please select the country you would like to search in. 2-char country codes only.").then(() => {
						const filterTwo = m => message.author.id;
						message.channel.awaitMessages(filterTwo, {
							max: 1,
							time: 10000,
							errors: ['time']
						})
						.then(message => {
							message = message.first()
							const messageCountry = message;
							const messageCountryTable = {
								"word": `${messageCountry.content}`
							}
							message.channel.send(`You have chosen to search in \`${messageCountry.content}\``).then(() => {
								message.channel.send("Please select the language of the article you would like to search. 2-char language codes only.").then(() => {
									const filterThree = m => message.author.id;
									message.channel.awaitMessages(filterThree, {
										max: 1,
										time: 10000,
										errors: ['true']
									})
									.then(message => {
										message = message.first();
										const messageLang = message;
										const messageLangTable = {
											"word": `${messageLang.content}`
										}
										message.channel.send(`You have chosen to search in the \`${messageLang.content}\` language.`).then(() => {
											message.channel.send(`Here are the articles of \`${messageSearchTable["word"]}\`, searching in the \`${messageCountryTable["word"]}\`, in the \`${messageLangTable["word"]}\` language.`).then(() => {
												const options = {
													method: 'GET',
													url: 'https://newscatcher.p.rapidapi.com/v1/search',
													qs: { q: `${messageSearchTable["word"]}`, country: `${messageCountryTable["word"]}`, lang: `${messageLangTable["word"]}`, topic: `politics`, sort_by: 'date', media: 'True' },
													headers: {
														"x-rapidapi-key": `${keys.key}`,
														"x-rapidapi-host": `${keys.host}`
													},
													useQueryString: true
												}
												request(options, function(error, response, body) {
													if(error) throw new Error(error);
													console.log(body);
												})
											})
											.catch(collected => {
												message.channel.send('timeout');
											})
										
										})
									})
								})
							})
						})
					})
				})
			})
			
		})
	}
}

module.exports = politicsSearch;
