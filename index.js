require('dotenv').config();

let discord = require('discord.js');

let client = new discord.Client();

let token = process.env.TOKEN;

client.login(token);

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
});

client.on('message', (msg) => {
    if(msg.content.includes("!Rubot")){
        msg.reply("Hullo");
    };
    console.log(msg.content + " sent by " + msg.author.username);
});