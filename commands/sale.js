//let firstWord = totalWords.replace(/ .*/,'');

const Guitar = require("../DB/guitar");



module.exports = {
	name: 'sale',
	description: 'finds guitar sales',
	async execute(message,args) { 
        const cName = await Guitar.find({"name_identifier": `${args[0].toLowerCase()}`}).exec();
        console.log(cName);
    }
};