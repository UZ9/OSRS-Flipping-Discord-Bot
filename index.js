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

getData();
setInterval(getData, 300000);

function getData() {
  request.get('https://storage.googleapis.com/osb-exchange/summary.json')
  .then(function(response) {
    osrsItems = response.getBody();
    localStorage.removeItem("osrs-items");
    localStorage.setItem("osrs-items", JSON.stringify(osrsItems));
    
  })
  .fail(function(response) {
    console.log("Failed. " + response.getCode());
  });
  
}


client.commands = new Enmap();

//TODO: Create a better way of adding nested classes instead of manually looping through every folder

fs.readdir("./commands/", (err, files) => {
    if (err) return console.error(err);
    files.forEach(file => {
      if (!file.endsWith(".js")) return;
      let props = require(`./commands/${file}`);
      let commandName = file.split(".")[0];
      client.commands.set(commandName, props);
      
    });
  });

  fs.readdir("./commands/stats/", (err, files) => {
    if (err) return console.error(err);
    files.forEach(file => {
      if (!file.endsWith(".js")) return;
      let props = require(`./commands/stats/${file}`);
      let commandName = file.split(".")[0];
      client.commands.set(commandName, props);

      
    });
  });

  fs.readdir("./commands/flip/", (err, files) => {
    if (err) return console.error(err);
    files.forEach(file => {
      if (!file.endsWith(".js")) return;
      let props = require(`./commands/flip/${file}`);
      let commandName = file.split(".")[0];
      client.commands.set(commandName, props);

      
    });
  });

  fs.readdir("./commands/utils/", (err, files) => {
    if (err) return console.error(err);
    files.forEach(file => {
      if (!file.endsWith(".js")) return;
      let props = require(`./commands/utils/${file}`);
      let commandName = file.split(".")[0];
      client.commands.set(commandName, props);

      
    });
  });

  fs.readdir("./commands/skills/", (err, files) => {
    if (err) return console.error(err);
    files.forEach(file => {
      if (!file.endsWith(".js")) return;
      let props = require(`./commands/skills/${file}`);
      let commandName = file.split(".")[0];
      client.commands.set(commandName, props);

      
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

