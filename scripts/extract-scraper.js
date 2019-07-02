const fetch = require("node-fetch");
const fs = require('fs');
let countries = [];
let films =[];


const extractUrl = "https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exchars=200&explaintext=true&titles=";
let stream = fs.createWriteStream('extracts.csv');
stream.write('country,title,clean_title,extract'+'\r\n');
var lineReader = require('readline').createInterface({
    input:fs.createReadStream('films.csv')
});

//Get country, corresponding film title and push each into arrays at the same index
lineReader.on('line', function (line) {
    var country = line.substring(0, line.indexOf(','));
    var title = line.substring(line.indexOf(',')+1,line.length);
    if(title.charAt(0)==='"') title = title.substring(1,title.length-1);
    countries.push(country);
    films.push(title);
});

//Get the 200-char extract about the movie
async function getExtracts(){
    for (var i = 0; i < countries.length; i++) {
        let country = countries[i];
        let title = films[i];
        var url = extractUrl+encodeURIComponent(title);
    await fetch(url)
        .then(response => {
            return response.json();
        })
        .then(data => {
            let extract = '';
            let page = data.query.pages;
            let pageId = Object.keys(data.query.pages)[0];
            extract = page[pageId]['extract'];
            //console.log(extract);
            stream.write(country+','+'"'+title+'"'+','+'"'+title.replace(/_/g,' ')+'"'+','+'"'+extract+'"'+'\r\n');
        })
        .catch(err => {
            console.log(err);
        });
 
    }   
}

setTimeout(() => {
    getExtracts();
}, 10000);