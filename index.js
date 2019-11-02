// Load up the discord.js library
const Discord = require("discord.js");

const request = require('requestify');

const fs = require('fs');

const Enmap = require("enmap");

var LocalStorage = require('node-localstorage').LocalStorage;
var localStorage = new LocalStorage('scratch');

var osrsItems = {};


const client = new Discord.Client();


const config = require("./config.json");


client.on("ready", () => {

  console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`); 

  client.user.setActivity(`Flippin an' Dippin`);
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

  if (command === "flip") {
    if (args.length == 0) {
      errorMessage(message, ":x: Too few arguments", "Usage: ++flip <min-margin> *(max-margin) (price)")
      return;
    } else if (args.length > 3) {
      errorMessage(message, ":x: Too many arguments ", "Usage: ++flip <min-margin> (max-margin) (price)")
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
      errorMessage(message, ":x: No items found", "No items were found under that query. Please try with a greater scope.");
      return;
    }

    console.log(items.length);

    for (var i = 0; i < items.length; i++) {
      itemList += "**" + items[i].name + " (" + items[i].id + "):** " + (items[i].sell_average - items[i].buy_average) + "\n\n";
    }

    successMessage(message, "Flips", itemList);
    


  }

  if (command == "tanning") {

  }

});
getData();
setInterval(getData, 300000)
function getData() {
  console.log("Retrieving data...")
  request.get('https://storage.googleapis.com/osb-exchange/summary.json')
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


client.commands = new Enmap();

fs.readdir("./commands/", (err, files) => {
    if (err) return console.error(err);
    files.forEach(file => {
      if (!file.endsWith(".js")) return;
      let props = require(`./commands/${file}`);
      let commandName = file.split(".")[0];
      if (commandName != "info") {
        client.commands.set(commandName, props);
       } 
      
    });
  });

  fs.readdir("./events/", (err, files) => {
    if (err) return console.error(err);

    files.forEach(file => {
       const event = require("./events/" + file)
       let eventName = file.split(".")[0];
       if (eventName != "info") {
        client.on(eventName, event.bind(null, client));
       } 
       
    
    });
});




client.login(config.token);

module.exports = {
  successMessage: function(message, title, description) {
    message.channel.send(new Discord.RichEmbed()
    .setColor("#3895D3")
    .setTitle(title)
    .setDescription(description)
    .setTimestamp()
    .setFooter("Created by Yerti")
    )
  },
  
  errorMessage: function(message, title, description) {
    message.channel.send(new Discord.RichEmbed()
    .setColor("ff0000")
    .setTitle(title)
    .setDescription(description)
    .setTimestamp()
    .setFooter("Created by Yerti")
    )
  },

  nFormatter: function(num) {
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
  },

  numberWithCommas: function(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  
  
}



function filterByID(jsonObject, id) {return jsonObject.filter(function(jsonObject) {return (jsonObject['id'] == id);})[0];}

