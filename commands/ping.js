const Discord = require("discord.js");
const utils = require("../index.js");

exports.run = async function(client, message, args) {
    const m = await message.channel.send("Ping?");
    m.edit(`Pong! Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ping)}ms`);


}