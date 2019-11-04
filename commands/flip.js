const Discord = require("discord.js");

const request = require('requestify');
const path = require("path");
const fs = require("fs");
const utils = require ("../index.js");
const table = require('text-table');

var LocalStorage = require('node-localstorage').LocalStorage;
var localStorage = new LocalStorage('scratch');

var minMargin = -1;
var maxMargin = -1;
var maxPrice = -1;
var members = true;
var conditionList = [];

exports.run = function(client, message, args) {

      for (var arg of args) {
        console.log(`Arg: ${arg}`);


        arg = arg.toLowerCase();
        if (!arg.includes(":")) continue;
        if (arg.startsWith("min-margin")) {
          minMargin = parseInt(arg.split(":")[1]);
        }

        if (arg.startsWith("max-margin")) {
          maxMargin = parseInt(arg.split(":")[1]);
        }

        if (arg.startsWith("price")) {
          console.log("1");
          maxPrice = parseInt(arg.split(":")[1]);
        }

        if (arg.startsWith("members")) {
          members = arg.split(":")[1] === "true" ? true : false;
        }
      }


      var tempItems = [];
      var items = [];
      var count = 0;
      var values = JSON.parse(localStorage.getItem("osrs-items"));
  
      for (item in values) {
        item = values[item];
        var margin = item.sell_average - item.buy_average;
        conditionList = [];

        conditionList.push(isActiveItem);

        
        if (minMargin != -1) {
          conditionList.push(hasMinMargin);
        }

        if (maxMargin != -1) {
          conditionList.push(hasMaxMargin);
        }

        if (maxPrice != -1) {
          conditionList.push(hasMaxPrice);
        }

        if (members === false) {
          conditionList.push(isFreeToPlay);
        }

        if (checkItem(item, conditionList)) {
          count++;
          tempItems.push(item);
        } 

        console.log(conditionList.length);
    
  
        
      }

      //console.log(`Item Count: ${tempItems.length}`)
  
  
      if (tempItems.length < 5) {
        for (var i = 0; i < tempItems.length - 1; i++) {
            items[i] = tempItems[i];
        }
      } else {
        for (var i = 0; i < 5; i++) {
  
          var newItem = tempItems[Math.floor(Math.random() * tempItems.length)];
          if (items.includes(newItem)) {
            i--;
          } else {
            items[i] = newItem;
          }
        }
      }
  
  
  
      
  
      var itemList = [];
      if (items.length == 0) {
        utils.errorMessage(message, ":x: No items found", "No items were found under that query. Please try with a greater scope.");
        return;
      }
  
      console.log(`Count: ${count}`);

      itemList.push(["Name", "ID", "Buy Avg", "Sell Avg", "Margin"]);
  
      for (var i = 0; i < items.length; i++) {
        
        itemList.push([items[i].name, items[i].id, items[i].buy_average, items[i].sell_average, (items[i].sell_average - items[i].buy_average)]);
      }

      var t = table(itemList);

      var labels = t.split("\n")[0];
      t = t.split("\n").slice(1).join("\n");

      var msg = "```" + labels + "\n-----------------------------------------------------\n" + t + "```";
      

      utils.successMessage(message, "Flips", msg);

      //Reset variables
      minMargin = -1;
      maxMargin = -1;
      maxPrice = -1;
      members = true;

      
  
}

function isActiveItem(item) {
  return item.sell_average != 0 && item.buy_average != 0 && (item.sell_average - item.buy_average) > 0;
}

function hasMinMargin(item) {
  return item.sell_average - item.buy_average > minMargin; 
}

function hasMaxMargin(item) {
  return item.sell_average - item.buy_average < maxMargin;
}

function hasMaxPrice(item) {
  return item.buy_average < maxPrice;
}

function isFreeToPlay(item) {
  return item.members === false;
}


function checkItem(item, conditions) {
  for (condition of conditions) {
    if (!condition(item)) {
      return false;
    } 
  }

  return true;
}

