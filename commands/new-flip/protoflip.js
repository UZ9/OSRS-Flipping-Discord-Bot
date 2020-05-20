const Discord = require("discord.js");
const utils = require("../../index.js");
const request = require('requestify');

var LocalStorage = require('node-localstorage').LocalStorage;
var localStorage = new LocalStorage('scratch');

exports.run = async function(client, message, args) {
  if (args.length > 0) {
    var values = JSON.parse(localStorage.getItem("item-db"));

    var results = [];
    
    for (item in values) {
      item = values[item];

      var good = true;

      if (item.name.toLowerCase().includes(args.join(" ").toLowerCase())) {
        if (item.name.toLowerCase() == args.join(" ").toLowerCase()) {
          results = [];
          results.push(item);
          break;
        } else {
          results.push(item);
          console.log(item.name);
        }
      }

      /*for (var i = 0; i < args.length; i++) {
        if (!item.name.toLowerCase().includes(args[i].toLowerCase())) {
          good = false;
          
        }
      }

      if (good) {
        results.push(item);
        console.log(item.name);
      }*/
    }

    if (results.length == 0) {
      utils.errorMessage(message, ":x: Error", "No results were found for that query.");
    } else if (results.length > 20) {
      utils.errorMessage(message, ":x: Error", "Too many results were found for the query. Please narrow down your parameters.")
    } else if (results.length == 1) {
      request.get("https://www.osrsbox.com/osrsbox-db/items-json/" + results[0].id + ".json") 
      .then(function(response) {
        var target = JSON.parse(localStorage.getItem("osrs-items"))[results[0].id];
        var meta = response.getBody();
        utils.runescapeInfoImage(message, "Data for " + target.name + ": ", 
          
          "**ID:** " + results[0].id + "\n\n" +
          "**Members:** " + (target.members === true ? "Yes" : "No") + "\n\n"  + 
          "**Buy Average:** " + utils.numberWithCommas(parseInt(target.buy_average)) + " (" + utils.nFormatter(parseInt(target.buy_average)) + ") gp\n\n"  + 
          "**Sell Average:** " + utils.numberWithCommas(parseInt(target.sell_average)) + " (" + utils.nFormatter(parseInt(target.sell_average)) + ") gp\n\n"  +  
          "**Overall Average:** " + utils.numberWithCommas(parseInt(target.overall_average)) + " (" + utils.nFormatter(parseInt(target.overall_average)) + ") gp\n\n" + 
          "**Buy Limit:** " + (meta.buy_limit == null ? "∞" : meta.buy_limit) + "\n\n" + 
          "**Potential Profit:** " + Math.abs(target.sell_average - target.buy_average) + " gp\n\n" + 
          "**Overall Potential Profit:** " + utils.numberWithCommas(meta.buy_limit == null ? "∞" : (Math.abs(target.sell_average - target.buy_average) * meta.buy_limit)) + ` gp (${meta.buy_limit} * ${Math.abs(target.sell_average - target.buy_average)})\n\n` + 
          "*Note: Prices with 0gp are items that aren't traded enough to be recorded*",
          `https://www.osrsbox.com/osrsbox-db/items-icons/${results[0].id}.png`, results[0].wiki_url
        );
      })
      .fail(function(response) {
        utils.errorMessage(message, ":x: " + response.getCode(), "Incorrect OSRS Item ID");
      });
    } else {

      newOutput = [];

      var iCount = 0;

      for (var i = 0; i < results.length; i++) {
        console.log(`Finding value for cannonball (ID ${results[i].id})`);
        request.get("https://www.osrsbox.com/osrsbox-db/items-json/" + results[i].id + ".json") 
        .then(function(response) {
          iCount++;
          var target = response.getBody();
          console.log(JSON.stringify(target));
            if (target.tradeable && target.tradeable_on_ge) {
                console.log("all good, push")
                newOutput.push(target);
            }
        })
        .fail(function(response) {
          utils.errorMessage(message, ":x: " + response.getCode(), "Error retrieving an item.");
        });
      }

      //wait for requests to finish
      var e = setInterval(function() {sendQueryResults(message, i, results, newOutput, e)}, 1000);

      /*if (newOutput.length == 0) {
        utils.errorMessage(message, ":x: Error", "No results were found for that query.");
        return;
      }*/



    }


  } else {
    utils.errorMessage(message, ":x: Error", "Invalid amount of arguments.")
    return;
  }
} 

function sendQueryResults(message, iCount, results, newOutput, interval) {
  console.log(iCount);
  console.log(results.length);
  if (iCount == results.length) {
    console.log("roger roger");
    var output = "";

    for (var i = 0; i < newOutput.length; i++) {
      console.log(typeof(newOutput[i]));
      
      output += newOutput[i].name + "\n";
    }
    clearInterval(interval);
    
    if (newOutput.length == 1) {
      var target = JSON.parse(localStorage.getItem("osrs-items"))[newOutput[0].id];
        utils.runescapeInfoImage(message, "Data for " + target.name + ": ", 
          "**ID:** " + newOutput[0].id + "\n\n" +
          "**Members:** " + (target.members === true ? "Yes" : "No") + "\n\n"  + 
          "**Buy Average:** " + utils.numberWithCommas(parseInt(target.buy_average)) + " (" + utils.nFormatter(parseInt(target.buy_average)) + ") gp\n\n"  + 
          "**Sell Average:** " + utils.numberWithCommas(parseInt(target.sell_average)) + " (" + utils.nFormatter(parseInt(target.sell_average)) + ") gp\n\n"  +  
          "**Overall Average:** " + utils.numberWithCommas(parseInt(target.overall_average)) + " (" + utils.nFormatter(parseInt(target.overall_average)) + ") gp\n\n" + 
          "**Potential Profit:** " + Math.abs(target.sell_average - target.buy_average) + " gp\n\n" +
          "**Overall Potential Profit:** " + (Math.abs(target.sell_average - target.buy_average) * newOutput.buy_limit == null ? -1 : newOutput.buy_limit) + "gp\n\n" + 
          "*Note: Prices with 0gp are items that aren't traded enough to be recorded*",
          `https://www.osrsbox.com/osrsbox-db/items-icons/${newOutput[0].id}.png`, newOutput[0].wiki_url
        );
    } else {
      utils.successMessage(message, "Query Results", output);
    }
  } 
}

function printInfo(message, target, item) {
  utils.runescapeInfoImage(message, "Data for " + target.name + ": ", 
    "**ID:** " + newOutput[0].id + "\n\n" +
    "**Members:** " + (target.members === true ? "Yes" : "No") + "\n\n"  + 
    "**Buy Average:** " + utils.numberWithCommas(parseInt(target.buy_average)) + " (" + utils.nFormatter(parseInt(target.buy_average)) + ") gp\n\n"  + 
    "**Sell Average:** " + utils.numberWithCommas(parseInt(target.sell_average)) + " (" + utils.nFormatter(parseInt(target.sell_average)) + ") gp\n\n"  +  
    "**Overall Average:** " + utils.numberWithCommas(parseInt(target.overall_average)) + " (" + utils.nFormatter(parseInt(target.overall_average)) + ") gp\n\n" + 
    "**Potential Profit:** " + Math.abs(target.sell_average - target.buy_average) + " gp\n\n" +
    "**Overall Potential Profit:** " + (Math.abs(target.sell_average - target.buy_average) * item.buy_limit == null ? -1 : item.buy_limit) + "gp\n\n" + 
    "*Note: Prices with 0gp are items that aren't traded enough to be recorded*",
    `https://www.osrsbox.com/osrsbox-db/items-icons/${item.id}.png`, items.wiki_url
  );
}