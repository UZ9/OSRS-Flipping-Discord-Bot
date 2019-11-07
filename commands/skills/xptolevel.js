const Discord = require("discord.js");
const utils = require("../../index.js");
const {constants, hiscores} = require("osrs-api");

var LocalStorage = require('node-localstorage').LocalStorage;
var localStorage = new LocalStorage('scratch');



exports.run = async function(client, message, args) {

    if (args.length <= 1 || args.length > 2) {
        utils.errorMessage(message, ":x: Error", "Invalid amount of arguments.");
        return;
    }

    hiscores.getPlayer({ name: JSON.parse(localStorage.getItem("user-data"))[message.author.id].rsn, type: constants.playerTypes.ironman }).then(function(response) {
        for (value in response) {
            var vValue = response[value];
            if (value.toLowerCase() === args[0]) {
                var xp = vValue.experience;
                var target = experienceForLevel(parseInt(args[1]));
                utils.successMessage(message, "XP to level " + args[1] + ":", 
                `**Current Level:** ${vValue.level}\n\n` +
                `**Target Level:** ${args[1]}\n\n` +
                `**Current XP:** ${utils.numberWithCommas(vValue.experience)} xp\n\n` +
                `**Target XP:** ${utils.numberWithCommas(experienceForLevel(parseInt(args[1])))} xp\n\n` + 
                `**Needed XP:** ${utils.numberWithCommas(target - xp)} xp` 
                )
                
                


            }
            
        }
    });







}

function experienceForLevel(level)
{
	var total = 0;
	for (var i = 1; i < level; i++)
	{
		total += Math.floor(i + 300 * Math.pow(2, i / 7.0));
	}

	return Math.floor(total / 4);
}