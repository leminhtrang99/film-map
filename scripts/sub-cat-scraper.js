const fetch = require("node-fetch");
const fs = require('fs');
const http = require('http');
//const catUrl= "https://en.wikipedia.org/w/api.php?format=json&action=query&list=categorymembers&cmtitle=Category:Films_by_country_of_setting&cmlimit=500";
const catMemberUrl = "https://en.wikipedia.org/w/api.php?format=json&action=query&list=categorymembers&cmtitle=";
const pageViewsUrl = "https://wikimedia.org/api/rest_v1/metrics/pageviews/per-article/en.wikipedia/all-access/all-agents/";
const datePoints = "/daily/20150619/20190619";
const extractUrl = "https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exchars=200&explaintext=true&titles=";
let catMemberTitles = [];
let filmArray = [[]];
let numOfDays = 1461;

var stream = fs.createWriteStream('solomon_islands_films.csv');
var streamSubCat = fs.createWriteStream('solomon_islands_subcat.csv');
var streamPageViews = fs.createWriteStream('solomon_islands_views.csv');
let countries = [];
let categories=[];

streamPageViews.write('country,title,views_total,views_median,title_clean'+'\r\n');
stream.write('country,title'+'\r\n');

// var lineReader = require('readline').createInterface({
//     input:fs.createReadStream('portugal_subcat.csv')
// });

// lineReader.on('line', function (line) {
//     //var country = line.substring(22);
//     var country = line.substring(0, line.indexOf(','));
//     countries.push(country);
//     var category = line.substring(line.indexOf(',')+1,line.length);
//     category = category.substring(1, category.length-1);
//     categories.push(category);
// });




async function getData(){
    countries.push('Solomon_Islands');
    categories.push('Category:Films_set_in_the_Solomon_Islands');
for (var i = 0; i < countries.length; i++) {
    //console.log(catMemberUrl+catMemberTitles[i]+'&cmlimit=500');
    let country = countries[i];
    await fetch(catMemberUrl+encodeURIComponent(categories[i])+'&cmlimit=500')
        .then(response => {
            return response.json();
        })
        .then(data => {
            let films=[];
            for (var i = 0; i < data.query.categorymembers.length; i++) {
                let title = data.query.categorymembers[i]['title'];
                title = decodeURIComponent(title);
                if (title.substring(0,8)==='Category') {
                    streamSubCat.write(country+','+'"'+title.replace(/\s/g, '_')+'"'+'\r\n');
                } else {
                    films.push(title.replace(/\s/g, '_'));
                    var titleUnderScore = title.replace(/\s/g, '_');
                    //stream.write(country+','+'"'+title.replace(/\s/g, '_')+'"'+','+totalViews+','+medianViews+','+'"'+title+'"'+'\r\n');
                    //console.log(films);
                    getPageViews(titleUnderScore);
                    stream.write(country+','+'"'+titleUnderScore+'"'+'\r\n');
                }
            }
            filmArray.push(films);
            //console.log(filmArray);
                            
        })
        .catch(err => {
            console.log(err);
        });
    async function getPageViews(title){
        await fetch(pageViewsUrl+encodeURIComponent(title)+datePoints)
            .then(response=> {
                return response.json();
            })
            .then(data => {
                let totalViews = 0;
                let medianViews = 0;
                for (var j = 0; j < data.items.length;j++) {
                    totalViews+=data.items[j]['views'];
                }
                medianViews = totalViews/1461;
                streamPageViews.write(country+','+'"'+title.replace(/\s/g, '_')+'"'+','+totalViews+','+medianViews+','+'"'+title.replace(/_/g,' ')+'"'+'\r\n');
            })
            .catch(err => {
                console.log(err);
            });
    }

    }
}   

setTimeout(() => {
    getData();
}, 5000);

