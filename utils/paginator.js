const { RichEmbed } = require("discord.js")

module.exports = class Paginator {
  
  constructor(message, pages = [], color, reactionsDisabled = false) {

    this.message = message;
    this.rCollector = null;
    this.mCollector = null;
    this.sentMessage = null;
    this.reactor = message.author;
    this.pages = pages;
    this.currentPage = 0;
    this.pageColor = color;
    this.enabled = false;
    this.usingCustom = false;
    this.reactionsDisabled = reactionsDisabled;
    this.emotes = ["⏪", "⬅", "➡", "⏩", "⏸", "🔢"];
  }

  async start() {
        if (!this.enabled) await this.switchPage(0);
        if (this.reactionsDisabled) return;
        this.rCollector = this.sentMsg.createReactionCollector((reaction, user) => ["⏪", "⬅", "➡", "⏩", "⏸", "🔢"].includes(reaction.emoji.name) && user.id === this.reactor.id && reaction.remove(user).catch(() => {}), { time: 864e5 });
        this.rCollector.on("collect", async r => {
            switch (r.emoji.name) {
            case "⏪": { await this.firstPage(); break; }
            case "⬅": { await this.backward(); break; }
            case "➡": { await this.forward(); break; }
            case "⏩": { await this.lastPage(); break; }
            case "⏸": { await this.end(); break; }
            case "🔢": { await this.userInputPageSwitch(); break; }
            }
        });
        this.rCollector.on("end", () => this.end());
    }

    async switchPage(pageNum) {
        this.currentPage = pageNum;
        if (this.enabled) {
            if (this.currentPage.toString().match(/-[0-9]/)) return undefined;
            if (this.currentPage === this.pages.length) return undefined;
            return this.sentMsg.edit(new RichEmbed().setColor(this.pageColor).setFooter(`Showing page ${this.currentPage + 1} of ${this.pages.length}.`).addField(this.pages[this.currentPage].title, this.pages[this.currentPage].description));
        } else {
            this.enabled = true;
            this.sentMsg = await this.msg.channel.send(new RichEmbed().setColor(this.pageColor).setFooter(`Showing page ${this.currentPage + 1} of ${this.pages.length}.`).addField(this.pages[this.currentPage].title, this.pages[this.currentPage].description));
            if (this.reactionsDisabled) return;
            for (const e of this.emotes) {
                if (["⏪", "⏩", "🔢"].includes(e) && this.pages.length < 2) {} else {
                    await this.sentMsg.react(e).catch(() => {});
                }
            }
        }
    }

    async forward() {
        return await this.switchPage(this.currentPage + 1);
    }

    async backward() {
        return await this.switchPage(this.currentPage - 1);
    }

    async lastPage() {
        return await this.switchPage(this.pages.length - 1);
    }

    async firstPage() {
        return await this.switchPage(0);
    }

    async userInputPageSwitch() {
        const tm = await this.msg.channel.send("What page would you like to go to? **NOTE: This times out in 5 seconds, you can reply with `cancel`, `stop` to stop this selection.**");
        this.mCollector = this.msg.channel.createMessageCollector(m => m.author.id === this.reactor.id, { time: 5000, errors: ["time"] });
        this.mCollector.on("collect", m => {
            const userEnd = /cancel|stop/.exec(m.content);
            if (userEnd) {
                tm.delete();
                return this.mCollector.stop();
            }
            if (!this.pages[parseInt(m.content) - 1]) {
                let NAN = false;
                if (isNaN(m.content)) {
                    NAN = true;
                } else { NAN = false; }
                return this.msg.channel.send(`Invalid page provided \`[${NAN === true ? m.content : parseInt(m.content)}/${this.pages.length}\`]`)
                    .then(mm => {
                        setTimeout(() => mm.delete(), 1500);
                    });
            } else { this.switchPage(parseInt(m.content) - 1); }
            tm.delete();
            this.mCollector.stop();
        });
        this.mCollector.on("end", c => {
            if (c.size === 0) {
                return this.msg.channel.send("The selection timed out!")
                    .then(m => {
                        setTimeout(() => {
                            tm.delete();
                            m.delete();
                        }, 1500);
                    });
            }
        });
    }

    async end() {
        this.enabled = false;
        this.sentMsg.delete();
    }

};
