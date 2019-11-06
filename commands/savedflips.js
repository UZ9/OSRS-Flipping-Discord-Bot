const Discord = require("discord.js");
const utils = require("../index.js");
const fs = require("fs");
const request = require("requestify");

var LocalStorage = require('node-localstorage').LocalStorage;
var localStorage = new LocalStorage('scratch');
const table = require('text-table');


exports.run = async function(client, message, args) {

    var saved = JSON.parse(localStorage.getItem("saved-flips"));
    if (!saved) {
        utils.errorMessage(message, ":x: Error", "Local Storage not initialized. Creating storage now.");
        localStorage.setItem("saved-flips", {});
        return;
    }
    if (saved[message.author.id]) console.log("Good1");
    if (saved[message.author.id]['items']) console.log("good2");


    if (saved[message.author.id] && saved[message.author.id]['items']) {
        
        var msg = [];

        msg.push(["Name", "ID", "Members", "Buy Avg", "Sell Avg", "Margin"]);
        
        for (var id of saved[message.author.id]['items']) {
            await request.get('https://storage.googleapis.com/osb-exchange/item/' + id + '.json') 
            .then(function(response) {
              console.log("found response")
              var target = response.getBody();
              console.log("Bonk");
              msg.push([
              target.name,
              target.id, 
              target.members === true ? "Yes" : "No",  
              utils.numberWithCommas(parseInt(target.buy_average)),
              utils.numberWithCommas(parseInt(target.sell_average)),
              (target.sell_average - target.buy_average)
              ])
              console.log(msg);
            })

            .fail(function(response) {
              utils.errorMessage(message, ":x: " + response.getCode(), "Incorrect OSRS Item ID");
            });
            //msg += id + "\n";
        }
        var t = table(msg);
        console.log(t);
        var labels = t.split("\n")[0];
        t = t.split("\n").slice(1).join("\n");
        var e = "```" + labels + "\n--------------------------------------------------\n" + t + "```";
        utils.successMessage(message, `Saved flips for ${message.guild.members.get(message.author.id).displayName}`, e);
    } else {
        utils.errorMessage(message, `:x: Couldn't find any flips for ${message.guild.members.get(message.author.id).displayName}`, "Are you sure you saved any flips?");
    }

}