const Discord = require("discord.js");

const request = require('requestify');
const path = require("path");
const fs = require("fs");
const utils = require ("../index.js");

var LocalStorage = require('node-localstorage').LocalStorage;
var localStorage = new LocalStorage('scratch');

exports.run = function(client, message, args) {
    if (args.length == 0) {
        utils.errorMessage(message, ":x: Too few arguments", "Usage: ++flip <min-margin> *(max-margin) (price)")
        return;
      } else if (args.length > 3) {
        utils.errorMessage(message, ":x: Too many arguments ", "Usage: ++flip <min-margin> (max-margin) (price)")
        return;
      }
      var tempItems = [];
      var items = [];
      var count = 0;
      var values = JSON.parse(localStorage.getItem("osrs-items"));
  
      for (item in values) {
        item = values[item];
        var margin = item.sell_average - item.buy_average;
  
        if (args.length == 1) {
          if (margin > args[0] && item.sell_average != 0 && item.buy_average != 0) {
            count++;
            tempItems.push(item);
          }
        } else if (args.length == 2) {
            if (args.length == 3) {
              if (margin > args[0] && margin < args[1] && item.sell_average != 0 && item.buy_average != 0 && item.buy_average > args[2]);
            }
  
            if (margin > args[0] && margin < args[1] && item.sell_average != 0 && item.buy_average != 0) {
              count++;
              tempItems.push(item);
            
          } 
        }
  
  
        
      }
  
  
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
  
  
  
      
  
      var itemList = "<name> (id) : <margin> \n\n";
      if (items.length == 0) {
        utils.errorMessage(message, ":x: No items found", "No items were found under that query. Please try with a greater scope.");
        return;
      }
  
      console.log(items.length);
  
      for (var i = 0; i < items.length; i++) {
        itemList += "**" + items[i].name + " (" + items[i].id + "):** " + (items[i].sell_average - items[i].buy_average) + "\n\n";
      }
  
      utils.successMessage(message, "Flips", itemList);
      
  
}