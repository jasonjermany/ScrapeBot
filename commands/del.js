const Guitar = require('../DB/guitar');
const scraper = require('./scrape');



module.exports = {
	name: 'del',
	description: 'e',
	async execute(message,args) { 
        Guitar.collection.deleteMany({});
        scraper();
        console.log("e");
    }
};