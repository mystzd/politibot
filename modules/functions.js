const superagent = require("snekfetch");
const moment = require("moment");
require("moment-duration-format");

module.exports = (client) => {
	client.awaitRely = async (message, question, limit = 60000, embed = {}) => {
		const filter = m => m.author.id === message.author.id;
		await message.channel.send(question, { embed });
		try {
			const collected = await message.channel.awaitMessages(filter, { max: 1, time: limit, errors: ["time"] });
			return collected.first().content;
		} catch (error) {
			client.logger.error(error);
			return false;
		}
	};

	client.hastebin = (text, code = false) => {
		if(code && !["py", "js", "java", "hs", "rs", "cpp", "cs", "c", "cc", "rb", "coffeescript"].includes(code)) throw new Error("Invalid Code Extension.");
		return new Promise((resolve, reject) => {
			superagent.post("https://hastebin.com/documents")
			.send(text)
			.then(res => resolve(`https://hatebin.com/${res.body.key}${ code ? "." + code : "" }`)).catch(reject);
		});
	};

	client.ratelimit = async(message, cmd, duration) => {
		if(message.author.id === client.config.ownerID) return false;

		duration = duration * 1000;
		const ratelimits = client.ratelimits.get(message.author.id) || {};
		if(!ratelimits[cmd]) ratelimits[cmd] = Date.now() - duration;
		const difference = Date.now() - ratelimits[cmd];
		if(difference < duration) {
			return moment.duration(duration - difference).format("D [days], H [hours], m [minutes], s [seconds]", 1);
		} else {
			ratelimits[cmd] = Date.now();
			client.ratelimits.set(message.author.id, ratelimits);
			return true;
		}
	};
};
