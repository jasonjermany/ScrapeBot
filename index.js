const fs = require('fs');
const Discord = require('discord.js');
const {prefix, token} = require('./config.json');
const mongo = require('mongodb');
const mongoose = require('mongoose');
const client = new Discord.Client();
client.commands = new Discord.Collection();



const dbURI = 'mongodb+srv://jasonj19:46563626@cluster0.onjvf.mongodb.net/database1?retryWrites=true&w=majority';
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true})
    .then((result) => console.log("connected to db."))
    .catch((err) => console.log(err));




const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

client.once('ready', () => {
    console.log('Ready!');
})

client.login(token);

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

client.on('message', async (message) => {

    if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).trim().split(/ +/);
	const command = args.shift().toLowerCase();
    try {
        client.commands.get(command).execute(message, args);
    } catch (error) {
        console.error(error);
        console.log('there was an error trying to execute that command!');
    }
    
})
