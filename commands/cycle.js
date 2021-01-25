const Guitar = require('../DB/guitar');
const scraper = require('../commands/scrape.js');

async function cycle(){
    Guitar.collection.deleteMany({});
    scraper();
}

