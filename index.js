// Load up the discord.js library
const Discord = require("discord.js");

const request = require('requestify');

var LocalStorage = require('node-localstorage').LocalStorage;
var localStorage = new LocalStorage('scratch');

var osrsItems = {};


const client = new Discord.Client();


const config = require("./config.json");


client.on("ready", () => {

  console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`); 

  client.user.setActivity(`Flipping an' Dippin`);
});

client.on("guildCreate", guild => {

  console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
});

client.on("guildDelete", guild => {

  console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
});


client.on("message", async message => {

  if(message.author.bot) return;

  if(message.content.indexOf(config.prefix) !== 0) return;
  

  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  
  if(command === "ping") {
    const m = await message.channel.send("Ping?");
    m.edit(`Pong! Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ping)}ms`);
  }

  if (command === "lookup") {
    if (args.length > 0) {
      request.get('https://storage.googleapis.com/osb-exchange/item/' + args[0] + '.json') 
      .then(function(response) {
        console.log("found response")
        var target = response.getBody();
        console.log("Bonk");
        successMessage(message, "Data for ID " + args[0] + ": ", 
        "**Name:** " + target.name + "\n\n" +
        "**Members:** " + (target.members === true ? "Yes" : "No") + "\n\n"  + 
        "**Buy Average:** " + numberWithCommas(parseInt(target.buy_average)) + " (" + nFormatter(parseInt(target.buy_average)) + ") gp\n\n"  + 
        "**Sell Average:** " + numberWithCommas(parseInt(target.sell_average)) + " (" + nFormatter(parseInt(target.sell_average)) + ") gp\n\n"  +  
        "**Overall Average:** " + numberWithCommas(parseInt(target.overall_average)) + " (" + nFormatter(parseInt(target.overall_average)) + ") gp\n\n" + 
        "**Potential Profit:** " + (target.sell_average - target.buy_average) + " gp\n" 
        );
      })
      .fail(function(response) {
        errorMessage(message, ":x: " + response.getCode(), "Incorrect OSRS Item ID");
      });


    } else {
      errorMessage(message, ":x: Too few arguments", "Usage: ++lookup <id>");
      
    }

  }

  if (command === "flip") {
    if (args.length == 0) {
      errorMessage(message, ":x: Too few arguments", "Usage: ++flip <min-margin> *<max-margin>\n\n* *max margin is optional*")
      return;
    } else if (args.length > 2) {
      errorMessage(message, ":x: Too many arguments ", "Usage: ++flip <min-margin> <max-margin>\n\n* *max margin is optional*")
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
          if (margin > args[0] && margin < args[1] && item.sell_average != 0 && item.buy_average != 0) {
            count++;
            tempItems.push(item);
        } 
      }


      
    }

    for (var i = 0; i < 5; i++) {
      var newItem = tempItems[Math.floor(Math.random() * tempItems.length)];
      if (items.includes(newItem)) {
        i--;
      } else {
        items[i] = newItem;
        console.log(items[i].name + ": " + items[i].buy_average + ":" + items[i].sell_average);
      }
    
    }

    var itemList = "<name> (id) : <margin> \n\n";
    for (var i = 0; i < items.length; i++) {
      itemList += "**" + items[i].name + " (" + items[i].id + "):** " + (items[i].sell_average - items[i].buy_average) + "\n\n";
    }

    successMessage(message, "Flips", itemList);
    console.log("Found " + count + " total items.")


  }

});
getData();
setInterval(getData, 300000)
function getData() {
  console.log("Retrieving data...")
  request.get('https://rsbuddy.com/exchange/summary.json')
  .then(function(response) {
    console.log("Done!");
    osrsItems = response.getBody();
    localStorage.removeItem("osrs-items");
    localStorage.setItem("osrs-items", JSON.stringify(osrsItems));
    
  })
  .fail(function(response) {
    console.log("Failed. " + response.getCode());
  });
  
}



client.login(config.token);

function successMessage(message, title, description) {
  message.channel.send(new Discord.RichEmbed()
  .setColor("#3895D3")
  .setTitle(title)
  .setDescription(description)
  .setTimestamp()
  .setFooter("Created by Yerti")
  )
}

function errorMessage(message, title, description) {
  message.channel.send(new Discord.RichEmbed()
  .setColor("ff0000")
  .setTitle(title)
  .setDescription(description)
  .setTimestamp()
  .setFooter("Created by Yerti")
  )
}

function nFormatter(num) {
  if (num >= 1000000000) {
     return (num / 1000000000).toFixed(1).replace(/\.0$/, '') + 'G';
  }
  if (num >= 1000000) {
     return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  }
  if (num >= 1000) {
     return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  }
  return num;
}


function filterByID(jsonObject, id) {return jsonObject.filter(function(jsonObject) {return (jsonObject['id'] == id);})[0];}

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}