const Discord = require("discord.js");

const request = require('requestify');
const path = require("path");
const fs = require("fs");
const utils = require ("../index.js");

exports.run = function(client, message, args) {
    if (args.length > 0) {
        request.get('https://storage.googleapis.com/osb-exchange/item/' + args[0] + '.json') 
        .then(function(response) {
          console.log("found response")
          var target = response.getBody();
          console.log("Bonk");
          utils.successMessage(message, "Data for ID " + args[0] + ": ", 
          "**Name:** " + target.name + "\n\n" +
          "**Members:** " + (target.members === true ? "Yes" : "No") + "\n\n"  + 
          "**Buy Average:** " + utils.numberWithCommas(parseInt(target.buy_average)) + " (" + utils.nFormatter(parseInt(target.buy_average)) + ") gp\n\n"  + 
          "**Sell Average:** " + utils.numberWithCommas(parseInt(target.sell_average)) + " (" + utils.nFormatter(parseInt(target.sell_average)) + ") gp\n\n"  +  
          "**Overall Average:** " + utils.numberWithCommas(parseInt(target.overall_average)) + " (" + utils.nFormatter(parseInt(target.overall_average)) + ") gp\n\n" + 
          "**Potential Profit:** " + (target.sell_average - target.buy_average) + " gp\n" 
          );
        })
        .fail(function(response) {
          utils.errorMessage(message, ":x: " + response.getCode(), "Incorrect OSRS Item ID");
        });
  
  
    } else {
        utils.errorMessage(message, ":x: Too few arguments", "Usage: ++lookup <id>");
        
    }




}