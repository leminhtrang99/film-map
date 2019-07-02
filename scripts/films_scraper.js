const fetch = require("node-fetch");
const fs = require('fs');
const httpç = require('http');
const catUrl= "https://en.wikipedia.org/w/api.php?format=json&action=query&list=categorymembers&cmtitle=Category:Films_by_country_of_setting&cmlimit=500";
const catMemberUrl = "https://en.wikipedia.org/w/api.php?format=json&action=query&list=categorymembers&cmtitle=";
const pageViewsUrl = "https://wikimedia.org/api/rest_v1/metrics/pageviews/per-article/en.wikipedia/all-access/all-agents/";
const datePoints = "/daily/20150619/20190619";
const extractUrl = "https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exchars=200&explaintext=true&titles=";
let catMemberTitles = [];
let filmArray = [[]];
let numOfDays = 1461;

var stream = fs.createWriteStream('films1.csv');
var streamSubCat = fs.createWriteStream('subcat.csv');
var streamPageViews = fs.createWriteStream('page_views1.csv');

//Get all films in a Category:Films_set_in_X page
async function getData() {
    await fetch(catUrl)
        .then(response => {
            return response.json();
        })
        .then(data => {
            //Push all pages under the Category: page into an array
            let catMembers = [];
            catMembers = data.query.categorymembers;
            for (var i = 0; i < catMembers.length; i++) {
                catMemberTitles.push(catMembers[i]['title'].replace(/\s/g, '_'));
            }
        })
        .then(() => {
            crawlCatMembers();
        })
        .catch(err => {
            console.log(err);
        });

    async function crawlCatMembers(){
        //Write file headers
        streamPageViews.write('country,title,views_total,views_median,title_clean,extract'+'\r\n');
        stream.write('country,title'+'\r\n');
    //Access each title page in the array
    for (var i = 0; i < catMemberTitles.length; i++) {
        //Extract country
        let country = catMemberTitles[i].substring(22);
        await fetch(catMemberUrl+catMemberTitles[i]+'&cmlimit=500')
            .then(response => {
                return response.json();
            })
            .then(data => {
                let films=[];
                for (var i = 0; i < data.query.categorymembers.length; i++) {
                    let title = data.query.categorymembers[i]['title'];
                    title = decodeURIComponent(title);
                    //If the page is itself a Category: page, push into subcat array
                    if (title.substring(0,8)==='Category') {
                        streamSubCat.write(country+','+'"'+title.replace(/\s/g, '_')+'"'+'\r\n');
                    //If not, push into title array
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
        //Calculate page views 
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
}

getData();




