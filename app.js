const fs = require('fs');
const cheerio = require('cheerio');

function gettingSeats() {
// Load the HTML file
const html = fs.readFileSync('response.html', 'utf-8');

// Load the HTML into Cheerio
const $ = cheerio.load(html);

// Find the "Total Seats Remaining" row and extract the value
const seatsRemaining = $('td:contains("Total Seats Remaining:")').next().text().trim();

// Output the result
return seatsRemaining*1; //convert to Integer
};

module.exports = gettingSeats;