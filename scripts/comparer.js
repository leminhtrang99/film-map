const fs = require('fs');

let subcat = [];
let subcatSubcat = [];

//Read each subcategory in the first file
var lineReader2 = require('readline').createInterface({
    input:fs.createReadStream('island countries/island_country_subcatx2.csv')
});

//Read each subcategory in the scecond file
var lineReader1 = require('readline').createInterface({
    input:fs.createReadStream('island countries/island_country_subcatx4.csv')
});

//Push into arrays
lineReader1.on('line', function (line) {
    // //var country = line.substring(22);
    // var country = line.substring(0, line.indexOf(','));
    // countries.push(country);
    // var subcat = line.substring(line.indexOf(',')+1,line.length);
    // category = category.substring(1, category.length-1);
    // categories.push(category);
    subcat.push(line);
});

lineReader2.on('line', function (line) {
    subcatSubcat.push(line);
})

//Compare
function compare() {
    for (var i = 0; i < subcat.length; i++){
        let line = subcat[i];
    for (var j = 0; j < subcatSubcat.length; j++){
        if(line===subcatSubcat[j]) console.log(line);
    }
    }
}

setTimeout(() => {
    compare();    
}, 10000);

