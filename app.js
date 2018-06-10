const Discord = require("discord.js");
const dotenv = require("dotenv");
const express = require("express");
const ClientOAuth2 = require("client-oauth2");
const schedule = require("node-schedule");

dotenv.config();

if (!process.env.BOT_TOKEN || !process.env.CLIENT_SECRET) {
  console.log("Missing BOT_TOKEN and CLIENT_SECRET environment variables.");
}

const client = new Discord.Client();

const oauth = new ClientOAuth2({
  clientId: "455143007927402507",
  clientSecret: process.env.CLIENT_SECRET,
  accessTokenUri: "https://discordapp.com/api/oauth2/token",
  authorizationUri: "https://discordapp.com/api/oauth2/authorize",
  scopes: ["bot"],
  redirectUri: process.env.REDIRECT_URI
});

client.on("ready", ready);

client.login(process.env.BOT_TOKEN);

function sendMessage(target) {
  return () => {
    client.syncGuilds();
    for (const guild of client.guilds.values()) {
      let sentMessage = false;
      for (const channel of guild.channels.values()) {
        if (channel.type !== "text" || channel.name !== "boss-timers") continue;
        channel.send('@everyone ' + target + " will spawn in 15 minutes!");
      }
      if (!sentMessage) {
        console.log("didn't find boss-timers channel for " + guild.name);
      }
    }
  };
}

function ready() {
  console.log("Bot ready");
}

schedule.scheduleJob('45 8 ? * 1', sendMessage('Kzarka'));
schedule.scheduleJob('45 8 ? * 2', sendMessage('Karanda'));
schedule.scheduleJob('45 8 ? * 3', sendMessage('Nouver'));
schedule.scheduleJob('45 8 ? * 4', sendMessage('Kutum'));
schedule.scheduleJob('45 8 ? * 5', sendMessage('Kzarka'));
schedule.scheduleJob('45 8 ? * 6', sendMessage('Kutum'));
schedule.scheduleJob('45 8 ? * 7', sendMessage('Nouver'));

schedule.scheduleJob('45 11 ? * 1', sendMessage('Karanda and Nouver'));
schedule.scheduleJob('45 11 ? * 2', sendMessage('Kzarka and Kutum'));
// none on wednesday
schedule.scheduleJob('45 11 ? * 4', sendMessage('Kzarka and Nouver'));
schedule.scheduleJob('45 11 ? * 5', sendMessage('Karanda and Kutum'));
schedule.scheduleJob('45 11 ? * 6', sendMessage('Kzarka and Nouver'));
schedule.scheduleJob('45 11 ? * 7', sendMessage('Karanda and Kzarka'));

schedule.scheduleJob('45 15 ? * 1', sendMessage('Kzarka and Kutum'));
schedule.scheduleJob('45 15 ? * 2', sendMessage('Kutum and Nouver'));
schedule.scheduleJob('45 15 ? * 3', sendMessage('Karanda and Kzarka'));
schedule.scheduleJob('45 15 ? * 4', sendMessage('Karanda and Kutum'));
schedule.scheduleJob('45 15 ? * 5', sendMessage('Karanda and Nouver'));
schedule.scheduleJob('45 15 ? * 6', sendMessage('Quint and Muraka'));
schedule.scheduleJob('45 15 ? * 7', sendMessage('Vell'));

schedule.scheduleJob('45 18 ? * 1', sendMessage('Offin'));
schedule.scheduleJob('45 18 ? * 2', sendMessage('Karanda'));
schedule.scheduleJob('45 18 ? * 3', sendMessage('Offin'));
schedule.scheduleJob('45 18 ? * 4', sendMessage('Nouver'));
schedule.scheduleJob('45 18 ? * 5', sendMessage('Offin'));
schedule.scheduleJob('45 18 ? * 6', sendMessage('Kzarka and Kutum'));
schedule.scheduleJob('45 18 ? * 7', sendMessage('Kutum and Nouver'));

schedule.scheduleJob('45 23 ? * 1', sendMessage('Karanda and Kutum'));
schedule.scheduleJob('45 23 ? * 2', sendMessage('Kzarka and Nouver'));
schedule.scheduleJob('45 23 ? * 3', sendMessage('Kzarka and Kutum'));
schedule.scheduleJob('45 23 ? * 4', sendMessage('Karanda and Kzarka'));
schedule.scheduleJob('45 23 ? * 5', sendMessage('Kutum and Nouver'));
schedule.scheduleJob('45 23 ? * 6', sendMessage('Karanda and Nouver'));
schedule.scheduleJob('45 23 ? * 7', sendMessage('Kzarka and Kutum'));

express()
  .get("/invite", (req, res) => res.redirect(oauth.code.getUri({
    state: parseInt(Math.random() * 999999 + 1),
    query: {permissions: 133120}
  })))
  .get("/callback", (req, res) => {
    oauth.code.getToken(req.originalUrl, {state: req.params.state});
    res.send("Invite successful!");
  })
  .listen(process.env.PORT || 3000);