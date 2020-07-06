require('dotenv').config();
let discord = require('discord.js');
let client = new discord.Client();
const ytdl = require('ytdl-core');

let token = process.env.TOKEN;
let prefix = '!';
const queue = new Map();

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

    if(msg.content.toLowerCase().startsWith(`${prefix}rubot`)){
        msg.reply("Hullo");
    } else if (msg.content.toLowerCase().startsWith(`${prefix}play`)) {
        execute(msg, musicQueue);
        return;
    }  else if (msg.content.toLowerCase().includes("fitter happier")) {
        msg.channel.send('Fitter, happier \nMore productive \nComfortable \nNot drinking too much \nRegular exercise at the gym, three days a week \nGetting on better with your associate employee contemporaries \nAt ease \nEating well, no more microwave dinners and saturated fats \nA patient, better driver \nA safer car, baby smiling in back seat \nSleeping well, no bad dreams \nNo paranoia \nCareful to all animals, never washing spiders down the plughole \nKeep in contact with old friends, enjoy a drink now and then \nWill frequently check credit at moral bank, hole in wall \nFavours for favours, fond but not in love \nCharity standing orders on sundays, ring-road supermarket \nNo killing moths or putting boiling water on the ants \nCar wash, also on sundays \nNo longer afraid of the dark or midday shadows, nothing so ridiculously teenage and desperate \nNothing so childish \nAt a better pace, slower and more calculated \nNo chance of escape \nNow self-employed \nConcerned, but powerless \nAn empowered and informed member of societ, pragmatism not idealism \nWill not cry in public \nLess chance of illness \nTires that grip in the wet, shot of baby strapped in backseat \nA good memory \nStill cries at a good film \nStill kisses with saliva \nNo longer empty and frantic \nLike a cat \nTied to a stick \nThats driven into \nFrozen winter shit, the ability to laugh at weakness \nCalm, fitter, healthier and more productive \nA pig in a cage on antibiotics');
    } else {
        msg.reply('Please, enter a valid command.');
    }
    console.log(msg.content + " sent by " + msg.author.username);
});

async function execute(message, musicQueue) {
    console.log(message.content.length);
    const songName = message.content.substring(" ", message.content.length + 1);
    console.log("SONG " + songName);
    const voiceChannel = message.member.voice.channel;
    if(!voiceChannel) return message.reply("Please enter a voice channel to crank that soulja boi.");
    let permissions = voiceChannel.permissionsFor(message.client.user);
    if(!permissions.has("CONNECT") || !permissions.has("SPEAK")) return message.channel.send("Please allow me to turn that shit up.");

    message.channel.send("This shit bout to get wild fam, yo turn that soulja boi :tired_face: :ok_hand:")

    const songInfo = await ytdl.getInfo(songName);
    let song = {
        title: songInfo.title,
        url: songInfo.video_url,
        author: songInfo.author
    };

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
            return message.channel.send("There has been an error: " + error);
        
        }
    } else {
        musicQueue.songs.push(song);
        console.log(musicQueue.songs);
        return message.channel.send(`${song.title} has been added to the queueueueue.`);

    } //Hacer switch para los comandos

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
