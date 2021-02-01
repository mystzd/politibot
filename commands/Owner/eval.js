const Command = require("../../base/Command.js");
const { inspect } = require("util");

class Eval extends Command {
  constructor(client) {
    super(client, {
      name: "eval",
      description: "Evalutes arbitrary javascript",
      usage: "eval <code>",
      ownerOnly: true,
      category: "Owner",
      aliases: ["ev"],
      extended: "Evalutes any javascript/nodejs code for bot owner only."
    });
  }
  
  async run(message, args) {
    const code = args.join(" ");
    const token = this.client.token.split("").join("[^]{0,2}");
    const rev = this.client.token.split("").reverse().join("[^]{0,2}");
    const filter = new RegExp(`${token}|${rev}`, "g");
    try {
      let output = eval(code);
      if (output instanceof Promise || (Boolean(output) && typeof output.then === "function" && typeof output.catch === "function")) output = await output;
      output = inspect(output, { depth: 0, maxArrayLength: null });
      output = output.replace(filter, "[TOKEN]");
      output = clean(output);
      message.channel.send(output, { code: "js", split: "\n" });
      
    } catch (error) {
      message.channel.send(`The following error occured \`\`\`js\n${error}\`\`\``);
    }

    function clean(text)  {
      return text
        .replace(/`/g, "`" + String.fromCharCode(8203))
        .replace(/@/g, "@" + String.fromCharCode(8203));
    }
}
}

module.exports = Eval;
