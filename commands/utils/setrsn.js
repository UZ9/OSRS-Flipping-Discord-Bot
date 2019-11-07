const Discord = require("discord.js");
const utils = require("../../index.js");

var LocalStorage = require('node-localstorage').LocalStorage;
var localStorage = new LocalStorage('scratch');


exports.run = async function(client, message, args) {
    if (args.length > 0) {
        users = JSON.parse(localStorage.getItem("user-data"));
        if (!users) {
            await localStorage.setItem("user-data", JSON.stringify({}));
        } 

        if (!users[message.author.id]) users[message.author.id] = {};         
        if (!users[message.author.id].rsn) users[message.author.id].rsn = "";

        users[message.author.id].rsn = args.join(" ");
        localStorage.setItem("user-data", JSON.stringify(users));
        utils.successMessage(message, "Success", "Set your username to " + args.join(" ") + ".") ;
            
        


    } else {
        utils.errorMessage(message, ":x: Error", "Invalid amount of arguments.")
        return;
    }
}