const Discord = require("discord.js");

const request = require('requestify');
const path = require("path");
const fs = require("fs");
const utils = require ("../index.js");
const {constants, hiscores} = require("osrs-api");
const table = require('text-table');


const toNumericPairs = input => {
    const entries = Object.entries(input);
    return entries.map(entry => Object.assign(entry, { 0: +entry[0] }));
}

exports.run = function(client, message, args) {
    var outputArray = [];
    outputArray.push(["Name", "Rank", "Level", "XP"])

    if (args.length > 0) {
        hiscores.getPlayer({ name: args.join(" "), type: constants.playerTypes.hardcoreIronman }).then(function(response) {
            for (value in response) {
                vValue = response[value];
                if (vValue.level != null) {
                    outputArray.push([value.charAt(0).toUpperCase() + value.slice(1), "#" + vValue.rank, vValue.level, vValue.experience]);
                }
            }

            var t = table(outputArray);

            var labels = t.split("\n")[0];
            t = t.split("\n").slice(1).join("\n");
      
            var msg = "```" + labels + "\n------------------------------------------\n" + t + "```";

            utils.successMessage(message, "Stats for " + args.join(" ") + ":", msg);

        
        
        
        }).catch(function(response) {
            utils.errorMessage(message, ":x: Error 404", "That player doesn't exist.")
        });

        
    }




}

