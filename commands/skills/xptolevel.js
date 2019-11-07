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


    if (parseInt(args[1]) != args[1]) {
        utils.errorMessage(message, ":x: Error", "The second parameter needs to be an integer.");
        return;
    }

    if (!localStorage.getItem("user-data")) {
        localStorage.setItem("user-data", "{}");
        utils.errorMessage(message, ":x: Error", "Please set your runescape username using `++setrsn`.");
        return;
    }

    if (!JSON.parse(localStorage.getItem("user-data"))[message.author.id] || !JSON.parse(localStorage.getItem("user-data"))[message.author.id].rsn) {
        utils.errorMessage(message, ":x: Error", "Please set your runescape username using `++setrsn`.");
        return;
    }

    hiscores.getPlayer({ name: JSON.parse(localStorage.getItem("user-data"))[message.author.id].rsn, type: constants.playerTypes.ironman }).then(function(response) {
        for (value in response) {
            var vValue = response[value];
            if (value.toLowerCase() === args[0]) {
                var xp = vValue.experience;
                var target = experienceForLevel(parseInt(args[1]));
                if (target - xp <= 0) {
                    utils.errorMessage(message, ":x: Error", "You've already reached this level.");
                    return;
                }
                utils.successMessage(message, "XP to level " + args[1] + ":", 
                `**Current Level:** ${vValue.level}\n\n` +
                `**Target Level:** ${args[1]}\n\n` +
                `**Current XP:** ${utils.numberWithCommas(vValue.experience)} xp\n\n` +
                `**Target XP:** ${utils.numberWithCommas(experienceForLevel(parseInt(args[1])))} xp\n\n` + 
                `**Needed XP:** ${utils.numberWithCommas(target - xp)} xp` 
                )
                return;
                
                


            }
            
        }

        utils.errorMessage(message, ":x: Error", "The specified skill doesn't exist.")
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