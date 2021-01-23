const mongoose = require("mongoose");
const Guitar = require('../DB/guitar');
const puppeteer = require('puppeteer');
const scraper = require('../commands/scrape.js');

async function cycle(){
    Guitar.collection.deleteMany({});
    scraper();
}

