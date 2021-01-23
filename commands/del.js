const Guitar = require('../DB/guitar');



module.exports = {
	name: 'del',
	description: 'e',
	async execute(message,args) { 
        Guitar.collection.deleteMany({});
        console.log("e");
    }
};