const Command = require("../../base/Command.js");

class Help extends Command {
  constructor(client) {
    super(client, {
      name: "help",
      description: "Shows all commands",
      aliases: ["halp", "h", "commands"],
      usage: "help [command]",
      extended: "Shows all commands or a specific command info."
    });
  }
  
  run(message, args) {
    if(!args[0]) { 
      const myCommands = message.author.id === this.client.config.ownerID ? this.client.commands : this.client.commands.filter(cmd => cmd.category !== "Owner");
      const commandNames = myCommands.keyArray();
      const longest = commandNames.reduce((long, str) => Math.max(long, str.length), 0);
      let currentCategory = "";
      let output = "= Command List =\n\n[Use pb.help <commandname> for details]\n";
      const sorted = myCommands.array().sort((p, c) => p.category > c.category ? 1 :  p.name > c.name && p.category === c.category ? 1 : -1 );
      sorted.forEach(c => {
        const cat = c.category;
        if (currentCategory !== cat) {
          output += `\u200b\n== ${cat} ==\n`;
          currentCategory = cat;
        }
        output += `pb.${c.name}${" ".repeat(longest - c.name.length)} :: ${c.description}\n`;
      });
      message.channel.send(output, { code: "asciidoc", split: true });
    } else {
      const cmd = this.client.commands.get(args[0]) || this.client.commands.get(this.client.aliases.get(args[0]));
      if(!cmd) return message.reply("Hm couldn't find that command.");
      if(cmd.category === "Owner" && message.author.id !== this.client.config.ownerID) return message.reply("That is an owner command only!");
      message.channel.send(`= ${cmd.name} =\n${cmd.description}\nCategory :: ${cmd.category}\nUsage :: ${cmd.usage}\nAliases :: ${cmd.aliases.join(", ") || "No aliases"}\nFull Description: ${cmd.extended}`, { code: "asciidoc" });
    }
  }
}

module.exports = Help;
