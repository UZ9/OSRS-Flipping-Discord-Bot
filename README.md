# OSRS-Flipping-Discord-Bot
An OSRS discord bot used for doing flips on the Grand Exchange. 

# Installation 
Note: NodeJS needs to be installed as well as Requestify and dataStorage
1. Clone the repository and extract the files somewhere on your computer.
2. Go to the Discord Developer Panel and generate a token for your bot.
3. Replace the token in config.json with your own token.
4. Run the bot by doing "node index.js"

# TODO
- [x] Redo command setup to be handled with multiple classes 
- [x] Add optional max and price parameters 
- [ ] Finish README
- [ ] Add optional notifications for an item 
- [ ] Combine both RS APIs into one instead of separate (fix inconsistencies)
- [ ] Format messages 
- [ ] Add High Alch options 
- [ ] Pull graphs from runescape's API <optional>
- [ ] Add a 'builder' type command parameter, ie ++flip price:50 margin-min:3 margin-max: 9
