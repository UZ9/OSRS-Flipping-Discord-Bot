const Discord = require("discord.js")
const fs = require("fs");
const path = require("path");
const config = require("../config.json");


module.exports = (client, message) => {
    

    if (!message.channel.guild) return;

    if (message.author.bot) return;

    if (!message.channel)

    if (message.content.indexOf(client.config.prefix) !== 0) return;

    const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    const commandData = client.commands.get(command);

    if (!commandData) return;

    commandData.run(client, message, args);

}