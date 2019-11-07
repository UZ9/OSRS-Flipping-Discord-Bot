const Discord = require("discord.js");
const utils = require("../../index.js");

var LocalStorage = require('node-localstorage').LocalStorage;
var localStorage = new LocalStorage('scratch');


exports.run = async function(client, message, args) {
    if (args.length == 1) {
        if (typeof args[0] == "number") {

        }
        items = JSON.parse(localStorage.getItem("saved-flips"));
        if (!items) {
            localStorage.setItem("saved-flips", {});
        } else {
            if (!items[message.author.id]) items[message.author.id] = {};         
            if (!items[message.author.id]['items']) items[message.author.id]['items'] = [];

            if (items[message.author.id]['items'].includes(args[0])) {
                var i = 0;
                items[message.author.id]['items'].find(function(element) {
                    if (element === args[0]) {
                        items[message.author.id]['items'].splice(i, 1);
                        localStorage.setItem("saved-flips", JSON.stringify(items));
                        utils.successMessage(message, "Success", "Removed ID " + args[0] + " from the list.");
                        return;
                    }
                    i++;
                });
            } else {
                utils.errorMessage(message, ":x: Error", "The specified ID is not in your saved items.");
            }
            

            
            
        }


    } else {
        utils.errorMessage(message, ":x: Error", "Invalid amount of arguments.")
        return;
    }
}