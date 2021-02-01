const Command = require("../../base/Command.js");
const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');
const Discord = require('discord.js');
const keys = require('../../rapidapikeys.js');
const request = require('request');
const paginationEmbed = require('discord.js-pagination');

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
													qs: { q: `${messageSearchTable["word"]}`, country: `${messageCountryTable["word"]}`, lang: `${messageLangTable["word"]}`, topic: `politics`, sort_by: 'date', media: 'True', page: '1', page_size: '5' },
													headers: {
														"x-rapidapi-key": `${keys.key}`,
														"x-rapidapi-host": `${keys.host}`
													},
													useQueryString: true
												}
												request(options, function(error, response, body) {
													if(error) throw new Error(error);
													const info = JSON.parse(body);
													const em1 = new MessageEmbed();
													em1.setTitle(info.articles[0].title)
													em1.setURL(info.articles[0].link)
													em1.setImage(info.articles[0].media)
													em1.setAuthor(info.articles[0].rights.toProperCase())
													em1.setDescription(info.articles[0].summary)
													em1.setColor('RANDOM')
													const em2 = new MessageEmbed();
													em2.setTitle(info.articles[1].title)
													em2.setURL(info.articles[1].link)
													em2.setImage(info.articles[1].media)
													em2.setAuthor(info.articles[1].rights.toProperCase())
													em2.setDescription(info.articles[1].summary)
													em2.setColor('RANDOM')
													const em3 = new MessageEmbed();
													em3.setTitle(info.articles[2].title)
													em3.setURL(info.articles[2].link)
													em3.setImage(info.articles[2].media)
													em3.setAuthor(info.articles[2].rights.toProperCase())
													em3.setDescription(info.articles[2].summary)
													em3.setColor('RANDOM');
													const em4 = new MessageEmbed();
													em4.setTitle(info.articles[3].title)
													em4.setURL(info.articles[3].link)
                                                                                                        em4.setImage(info.articles[3].media)
                                                                                                        em4.setAuthor(info.articles[3].rights.toProperCase())
                                                                                                        em4.setDescription(info.articles[3].summary)
                                                                                                        em4.setColor('RANDOM');
													const em5 = new MessageEmbed();
													em5.setTitle(info.articles[4].title)
                                                                                                        em5.setURL(info.articles[4].link)
                                                                                                        em5.setImage(info.articles[4].media)
                                                                                                        em5.setAuthor(info.articles[4].rights.toProperCase())
                                                                                                        em5.setDescription(info.articles[4].summary)
                                                                                                        em5.setColor('RANDOM');
													const pages = [
														em1,
														em2,
														em3,
														em4,
														em5
													]
													paginationEmbed(message, pages);
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
