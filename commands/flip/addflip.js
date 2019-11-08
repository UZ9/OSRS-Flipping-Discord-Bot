const Discord = require("discord.js");
const utils = require("../../index.js");

var LocalStorage = require('node-localstorage').LocalStorage;
var localStorage = new LocalStorage('scratch');

exports.run = async function(client, message, args) {
    if (args.length == 1) {
        if (isNaN(args[0])) {
            utils.errorMessage(message, ":x: Error", "Your first argument needs to be an ID.");
            return;
        }
        items = JSON.parse(localStorage.getItem("saved-flips"));
        if (!items) {
            localStorage.setItem("saved-flips", {});
        } else {
            if (!items[message.author.id]) items[message.author.id] = {};         
            if (!items[message.author.id]['items']) items[message.author.id]['items'] = [];

            if (items[message.author.id]['items'].includes(args[0])) {
                utils.errorMessage(message, ":x: Error", "You already have this item saved.");
                return;
            }
            
                
            items[message.author.id]['items'].push(args[0]);

            localStorage.setItem("saved-flips", JSON.stringify(items));
            utils.successMessage(message, "Success", "Added ID " + args[0] + " to the list.");
            
            
        }


    } else {
        utils.errorMessage(message, ":x: Error", "Invalid amount of arguments.")
        return;
    }
}