require('dotenv').config();

let discord = require('discord.js');

let client = new discord.Client();

let token = process.env.TOKEN;

client.login(token);

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
});

client.on('message', (msg) => {
    if(msg.content.toLowerCase() === "!rubot"){
        msg.reply("Hullo");
    } else if (msg.content.toLowerCase().includes("fitter happier")) {
        msg.channel.send('Fitter, happier \nMore productive \nComfortable \nNot drinking too much \nRegular exercise at the gym, three days a week \nGetting on better with your associate employee contemporaries \nAt ease \nEating well, no more microwave dinners and saturated fats \nA patient, better driver \nA safer car, baby smiling in back seat \nSleeping well, no bad dreams \nNo paranoia \nCareful to all animals, never washing spiders down the plughole \nKeep in contact with old friends, enjoy a drink now and then \nWill frequently check credit at moral bank, hole in wall \nFavours for favours, fond but not in love \nCharity standing orders on sundays, ring-road supermarket \nNo killing moths or putting boiling water on the ants \nCar wash, also on sundays \nNo longer afraid of the dark or midday shadows, nothing so ridiculously teenage and desperate \nNothing so childish \nAt a better pace, slower and more calculated \nNo chance of escape \nNow self-employed \nConcerned, but powerless \nAn empowered and informed member of societ, pragmatism not idealism \nWill not cry in public \nLess chance of illness \nTires that grip in the wet, shot of baby strapped in backseat \nA good memory \nStill cries at a good film \nStill kisses with saliva \nNo longer empty and frantic \nLike a cat \nTied to a stick \nThats driven into \nFrozen winter shit, the ability to laugh at weakness \nCalm, fitter, healthier and more productive \nA pig in a cage on antibiotics');
    }
    console.log(msg.content + " sent by " + msg.author.username);
});