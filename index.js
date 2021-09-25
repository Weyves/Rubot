require('dotenv').config();
let discord = require('discord.js');
let client = new discord.Client();
const ytdl = require('ytdl-core');

let token = process.env.TOKEN;
let prefix = '!';
const queue = new Map();
const fortunes = [
    'Yes',
    'No',
    'Maybe',
    '*cums and dies*'
]

client.login(token);

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
});

client.once('reconnecting', () => {
    console.log('Reconnecting...');
});

client.once('disconnect', () => {
    console.log('Disconnected.');
});

client.on('message', (msg) => {
    if(msg.author.bot) return;
    if(!msg.content.startsWith(prefix)) return;

    const musicQueue = queue.get(msg.guild.id);

    let command = msg.content.substring(0, msg.content.indexOf(" ") + 1);
    console.log(command);
    if(command.trim() === "")
        command = msg.content;
    console.log("COMMAND: "+command);
    try {
        switch(command.trim()){
            case `${prefix}rubot`:
                msg.reply("Hullo");
                break;
            case `${prefix}play`:
                execute(msg, musicQueue);
                break;
            case `${prefix}skip`:
                skip(msg, musicQueue);
                break;
            case `${prefix}stop`:
                stop(msg, musicQueue);
                break;
            case `${prefix}fitter`:
                msg.channel.send('Fitter, happier \nMore productive \nComfortable \nNot drinking too much \nRegular exercise at the gym, three days a week \nGetting on better with your associate employee contemporaries \nAt ease \nEating well, no more microwave dinners and saturated fats \nA patient, better driver \nA safer car, baby smiling in back seat \nSleeping well, no bad dreams \nNo paranoia \nCareful to all animals, never washing spiders down the plughole \nKeep in contact with old friends, enjoy a drink now and then \nWill frequently check credit at moral bank, hole in wall \nFavours for favours, fond but not in love \nCharity standing orders on sundays, ring-road supermarket \nNo killing moths or putting boiling water on the ants \nCar wash, also on sundays \nNo longer afraid of the dark or midday shadows, nothing so ridiculously teenage and desperate \nNothing so childish \nAt a better pace, slower and more calculated \nNo chance of escape \nNow self-employed \nConcerned, but powerless \nAn empowered and informed member of societ, pragmatism not idealism \nWill not cry in public \nLess chance of illness \nTires that grip in the wet, shot of baby strapped in backseat \nA good memory \nStill cries at a good film \nStill kisses with saliva \nNo longer empty and frantic \nLike a cat \nTied to a stick \nThats driven into \nFrozen winter shit, the ability to laugh at weakness \nCalm, fitter, healthier and more productive \nA pig in a cage on antibiotics');
                break;
            case `${prefix}fortune`:
                let randomNo = Math.floor(Math.random() * fortunes.length);
                msg.channel.send(fortunes[randomNo]);
            default:
                msg.channel.send('I don\'t know that command, try again.');
        }
    } catch (error) {
        msg.channel.send('An unhandled error was encountered. Help me @justves !');
        console.log(error);
    }
});

async function execute(message, musicQueue) {
    const songName = message.content.substring(message.content.indexOf(" "), message.content.length + 1).trim();
    console.log("SONG (" + songName + ")");
    const voiceChannel = message.member.voice.channel;
    if(!voiceChannel) return message.reply("Please enter a voice channel :).");
    let permissions = voiceChannel.permissionsFor(message.client.user);
    if(!permissions.has("CONNECT") || !permissions.has("SPEAK")) return message.channel.send("I need speaking permissions on this channel to play music.");
    const songInfo = await ytdl.getInfo(songName);
    let song = {
        title: songInfo.videoDetails.title,
        url: songName,
        author: songInfo.videoDetails.media.artist
    };
    console.log(song);
    message.channel.send("Got it! :ok_hand:");
    if(!musicQueue) {
        const queueContract = {
            textChannel: message.channel,
            voiceChannel: voiceChannel,
            connection: null,
            songs: [],
            volume: 5,
            playing: true
        };
        queue.set(message.guild.id, queueContract);
        queueContract.songs.push(song);
        try {
            let connection = await voiceChannel.join();
            queueContract.connection = connection;
            play(message.guild, queueContract.songs[0]);
        } catch (error) {
            console.log(error);
            queue.delete(message.guild.id);
            return message.channel.send('There has been an error: ' + error);
        }
    } else {
        musicQueue.songs.push(song);
        console.log(musicQueue.songs);
        return message.channel.send(`${song.title} has been added to the queueueueue.`);
    }
}

function play(guild, song){
    let serverQueue = queue.get(guild.id);
    if(!song){
        serverQueue.voiceChannel.leave();
        queue.delete(guild.id);
        return;
    }
    let dispatcher = serverQueue.connection.play(ytdl(song.url))
                    .on("finish", () => {
                        serverQueue.songs.shift();
                        play(guild, serverQueue.songs[0]);
                    }).on("error", (error) => console.log(error));
    dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
    serverQueue.textChannel.send(`Now playing: \'${song.title}\'`);
}

function skip(message, musicQueue) {
    if(!message.member.voice.channel)
        return message.reply('You need to be in a voice channel first.');
    if(!musicQueue)
        return message.channel.send('There\'s no next song.');
    musicQueue.connection.dispatcher.end();
}

function stop(message, musicQueue) {
    if(!message.member.voice.channel)
        return message.reply('You need to be in a voice channel first');
    if(!musicQueue)
        return message.channel.send('There\'s nothing playing right now dummy.');
    musicQueue.songs = [];
    musicQueue.connection.dispatcher.end();
    return message.reply('I guess I\'ll just leave.');
}