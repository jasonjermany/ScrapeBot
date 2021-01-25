//let firstWord = totalWords.replace(/ .*/,'');

const Guitar = require("../DB/guitar");
const  Discord  = require('discord.js');

module.exports = {
	name: 'sale',
	description: 'finds guitar sales',
	async execute(message,args) { 
        if(!args[0]){
            console.log("type a word.");
            return;
        }

        let low = args[0].toLowerCase();
        const cName = await Guitar.find({ "guitar_name": { "$regex": `${low}`, "$options": "i" } }).exec();
        const num = cName.length;
        console.log(num);
        let div = num/5;
        let pages = [];
        let page = 1;
        let count = 0;
        let inc1 = 0;
        let inc2 = 5;
        let ls = 1;

        if(cName[0] === ''){
            message.channel.send("no results!");
        }
        
        cName.slice(inc1, inc2).map(function(a){
            count++;
            const exampleEmbed = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setTitle(a.guitar_name)
            .setURL(a.link)
            .setDescription("`Sale Price:` " + "**" + a.sale_price + "**" + " \n`Original Price:` " + "**" + a.original_price + "**" + " \n`You save:` **$" + a.price_difference + "**")
            .setThumbnail(a.guitar_image);

            if(count % 5 == 0){
                exampleEmbed
                .setFooter(`Load more results? (${count}/${num})`, 'https://i.imgur.com/wSTFkRM.png');
            }
            if(count === num){
                exampleEmbed
                .setFooter(`No more results. (${count}/${num})`, 'https://i.imgur.com/wSTFkRM.png');
            }

            message.channel.send(exampleEmbed);
        })
            
        const collector = message.channel.createMessageCollector(
            msg => msg.author.id == message.author.id,
            {time: 30000}
          );
          for await (const msg of collector) {
            if (msg.content.toLowerCase() === "yes") {
                inc1 += 5; 
                inc2 += 5;
                cName.slice(inc1, inc2).map(function(a){
                    count++;
                    const exampleEmbed = new Discord.MessageEmbed()
                    .setColor('#0099ff')
                    .setTitle(a.guitar_name)
                    .setURL(a.link)
                    .setDescription("`Sale Price:` " + "**" + a.sale_price + "**" + " \n`Original Price:` **$" + a.original_price + "**" + " \n`You save:` **$" + a.price_difference + "**")
                    .setThumbnail(a.guitar_image);
        
                    if(count % 5 == 0){
                        exampleEmbed
                        .setFooter(`Load more results? (${count}/${num})`, 'https://i.imgur.com/wSTFkRM.png');
                    }
                    if(count === num){
                        exampleEmbed
                        .setFooter(`No more results. (${count}/${num})`, 'https://i.imgur.com/wSTFkRM.png');
                    }
    
                    message.channel.send(exampleEmbed);
                    return;
                })
            }
            if(msg.content.toLowerCase() === "no"){
                collector.stop();
            }
        }
    }

};