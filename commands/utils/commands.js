const Discord = require("discord.js");
const utils = require("../../index.js");

exports.run = async function(client, message, args) {
    utils.successMessage(message, "Commands", "You can find the commands [on the github page](https://github.com/UZ9/OSRS-Flipping-Discord-Bot).");

}