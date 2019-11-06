# OSRS-Flipping-Discord-Bot
An OSRS discord bot used for doing flips on the Grand Exchange. 

# Installation 
Note: NodeJS needs to be installed as well as Requestify and dataStorage
1. Clone the repository and extract the files somewhere on your computer.
2. Go to the Discord Developer Panel and generate a token for your bot.
3. Replace the token in `config.json` with your own token.
4. (Optional) Change the 'prefix' value in `config.json` with a new prefix if needed. 
5. Run the bot by doing `node index.js`

# TODO
- [x] Redo command setup to be handled with multiple classes 
- [x] Add optional max and price parameters 
- [ ] Finish README
- [ ] Add optional notifications for an item 
- [x] Combine both RS APIs into one instead of separate (fix inconsistencies)
- [x] Format messages 
- [ ] Add High Alch options 
- [ ] Pull graphs from runescape's API <optional>
- [x] Add a 'builder' type command parameter, ie ++flip price:50 margin-min:3 margin-max: 9

# Commands
`prefix` - ++

| Name           | Description                                                                                                                                                                                                                                                                                                                                | Usage              |
|----------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------|
| **lookup**     | Looks up an item and its GE values                                                                                                                                                                                                                                                                                                         | lookup <id>        |
| **flips**      | Queries the OSRS items for suitable flipping profits. Uses a builder-like command structure. Parameters (All optional): `max-margin`, `min-margin`, `price`, `members` | flips <parameters> |
| **stats**      | Looks up the rankings and hiscores for a player. The command currently only supports normal  osrs players, but soon will be compatible with IM, HCIM, and other character types.                                                                                                                                                           | stats <name>       |
| **savedflips** | Lists your personal saved lists. These are changed by `addflip` and `removeflip`.                                                                                                                                                                                                                                                          | savedflips         |
| **addflip**    | Adds an item ID to your personal flip list.                                                                                                                                                                                                                                                                                                | addflip <id>       |
| **removeflip** | Removes an item ID from your personal flip list.            
