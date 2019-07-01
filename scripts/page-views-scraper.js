const fetch = require("node-fetch");
const fs = require('fs');
const pageViewsUrl = "https://wikimedia.org/api/rest_v1/metrics/pageviews/per-article/en.wikipedia/all-access/all-agents/";
const datePoints = "/daily/20150619/20190619";

const extractUrl = "https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exchars=200&explaintext=true&titles=";
let numOfDays = 1461;

let stream = fs.createWriteStream('page-views.csv');
stream.write('country,title,views_total,views_median,clean_title'+'\r\n');
// var lineReader = require('readline').createInterface({
//     input:fs.createReadStream('films.csv')
// })


function getPageViews(title, country){
    var url = "https://wikimedia.org/api/rest_v1/metrics/pageviews/per-article/en.wikipedia/all-access/all-agents/Greedy_Lying_Bastards/daily/20150619/20190619";
    fetch(url)
        .then(response => {
            return response.json();
        })
        .then(data => {
            let totalViews = 0;
            let medianViews = 0;
            for (var i = 0; i < data.items.length;i++) {
                totalViews+=data.items[i]['views'];
            }
            medianViews = totalViews/1461;
            stream.write(country+','+'"'+title+'"'+','+totalViews+','+medianViews+','+'"'+title.replace(/_/g,' ')+'"'+'\r\n');
        })
        .catch(err => {
            console.log(err);
        });
}
    
getPageViews("Greedy_Lying_Bastards", 'Tuvalu');